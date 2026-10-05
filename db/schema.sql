-- Applied unchanged to Supabase and local PostgreSQL. auth.uid() supplies identity.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 60),
  adult_confirmed boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.couple_spaces (
  id uuid primary key default gen_random_uuid(),
  state text not null default 'active' check(state in ('active','closed')),
  created_at timestamptz not null default now()
);
create table public.memberships (
  couple_space_id uuid not null references public.couple_spaces(id),
  user_id uuid not null references public.profiles(id),
  status text not null default 'active' check(status in ('active','left')),
  intimacy_enabled boolean not null default false,
  faith_enabled boolean not null default false,
  joined_at timestamptz not null default now(), left_at timestamptz,
  primary key(couple_space_id,user_id)
);
create unique index one_active_space_per_person on public.memberships(user_id) where status='active';
create index membership_space_active on public.memberships(couple_space_id) where status='active';
create table private.invites (
  id uuid primary key default gen_random_uuid(),
  couple_space_id uuid not null references public.couple_spaces(id),
  token_hash text unique not null,
  expires_at timestamptz not null default now()+interval '48 hours',
  revoked boolean not null default false, used_by uuid references public.profiles(id)
);
create table private.features (singleton boolean primary key default true check(singleton),intimacy_pilot boolean not null default false);
insert into private.features values(true,false);

create function private.is_member(space_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and exists(select 1 from public.memberships m join public.couple_spaces s on s.id=m.couple_space_id where m.couple_space_id=space_id and m.user_id=auth.uid() and m.status='active' and s.state='active');
$$;
create function private.intimacy_allowed(space_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select private.is_member(space_id) and (select intimacy_pilot from private.features where singleton) and
    (select count(*)=2 and bool_and(intimacy_enabled) from public.memberships where couple_space_id=space_id and status='active');
$$;
create function private.faith_allowed(space_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select private.is_member(space_id) and (select count(*)=2 and bool_and(faith_enabled) from public.memberships where couple_space_id=space_id and status='active');
$$;
create function private.membership_limit() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  -- Parent row lock serializes concurrent joins and protects the invariant even for privileged writes.
  perform 1 from public.couple_spaces where id=new.couple_space_id for update;
  if new.status='active' and (select count(*) from public.memberships where couple_space_id=new.couple_space_id and status='active' and user_id<>new.user_id)>=2 then raise exception 'Space is full' using errcode='23514'; end if;
  return new;
end $$;
create trigger max_two_members before insert or update on public.memberships for each row execute function private.membership_limit();

create table public.shared_objects (
  id uuid primary key default gen_random_uuid(), couple_space_id uuid not null references public.couple_spaces(id),
  created_by uuid not null default auth.uid() references public.profiles(id),
  kind text not null check(kind in ('url','note','idea')),
  title text not null check(length(title) between 1 and 180), body text check(length(body)<=4000),
  source_url text check(length(source_url)<=2048 and (source_url is null or source_url ~ '^https?://')),
  source_type text not null default 'manual',
  category text not null default 'other' check(category in ('other','watch','eat','do','want','listen','faith','intimacy')),
  status text not null default 'saved' check(status in ('saved','considering','done','archived')),
  sensitivity text not null default 'ordinary' check(sensitivity in ('ordinary','private-couple','explicit-intimate')),
  preview_policy text generated always as (case when sensitivity='ordinary' then 'safe' else 'discreet' end) stored,
  metadata jsonb not null default '{}', created_at timestamptz not null default now(), experienced_at timestamptz,
  check(category<>'intimacy' or sensitivity='explicit-intimate'),
  check(category<>'faith' or sensitivity<>'ordinary')
);
create index objects_space_created on public.shared_objects(couple_space_id,created_at desc);
create table public.reactions (
  object_id uuid not null references public.shared_objects(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id),
  reaction_type text not null check(reaction_type in ('interested','love','maybe','not_for_me')),
  updated_at timestamptz not null default now(), primary key(object_id,user_id)
);
create table public.question_cards (
  id uuid primary key default gen_random_uuid(), couple_space_id uuid not null references public.couple_spaces(id),
  created_by uuid not null default auth.uid() references public.profiles(id),
  prompt text not null check(length(prompt) between 1 and 1000),
  domain text not null check(domain in ('everyday','playful','relationship','intimacy','faith')),
  sensitivity text not null check(sensitivity in ('ordinary','private-couple','explicit-intimate')),
  preview_policy text generated always as (case when sensitivity='ordinary' then 'safe' else 'discreet' end) stored,
  prompt_source text not null default 'custom' check(prompt_source in ('custom','curated')),
  state text not null default 'open' check(state in ('open','archived')),
  created_at timestamptz not null default now(),
  check(domain<>'intimacy' or sensitivity='explicit-intimate'), check(domain<>'faith' or sensitivity<>'ordinary')
);
create index questions_space_created on public.question_cards(couple_space_id,created_at desc);
create table public.question_responses (
  question_card_id uuid not null references public.question_cards(id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles(id),
  state text not null check(state in ('answered','passed','not_now')), answer text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  primary key(question_card_id,user_id),
  check((state='answered' and answer is not null and length(trim(answer)) between 1 and 4000) or (state<>'answered' and answer is null))
);
create table public.events (
  id uuid primary key default gen_random_uuid(), couple_space_id uuid not null references public.couple_spaces(id),
  user_id uuid not null default auth.uid() references public.profiles(id),
  name text not null check(name in ('pair_invite_created','pair_joined','object_captured','reaction_set','question_card_created','question_card_answered','question_card_passed','question_card_not_now','object_completed','decision_candidate_selected')),
  created_at timestamptz not null default now()
  -- No content payload column: logging cannot silently become a copy of private text.
);

alter table public.profiles enable row level security;
alter table public.couple_spaces enable row level security;
alter table public.memberships enable row level security;
alter table public.shared_objects enable row level security;
alter table public.reactions enable row level security;
alter table public.question_cards enable row level security;
alter table public.question_responses enable row level security;
alter table public.events enable row level security;
alter table private.invites enable row level security;
alter table private.features enable row level security;

create policy own_or_partner_profile on public.profiles for select to authenticated using(id=auth.uid() or exists(select 1 from public.memberships m where m.user_id=id and private.is_member(m.couple_space_id)));
create policy space_member on public.couple_spaces for select to authenticated using(private.is_member(id));
create policy membership_read on public.memberships for select to authenticated using(private.is_member(couple_space_id));
create policy object_read on public.shared_objects for select to authenticated using(private.is_member(couple_space_id) and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id)));
create policy object_insert on public.shared_objects for insert to authenticated with check(private.is_member(couple_space_id) and created_by=auth.uid() and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id)) and (category<>'faith' or private.faith_allowed(couple_space_id)));
create policy object_update on public.shared_objects for update to authenticated using(private.is_member(couple_space_id) and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id))) with check(private.is_member(couple_space_id) and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id)));
create policy object_delete on public.shared_objects for delete to authenticated using(created_by=auth.uid() and private.is_member(couple_space_id));
create policy reaction_read on public.reactions for select to authenticated using(exists(select 1 from public.shared_objects o where o.id=object_id));
create policy reaction_insert on public.reactions for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.shared_objects o where o.id=object_id));
create policy reaction_update on public.reactions for update to authenticated using(user_id=auth.uid() and exists(select 1 from public.shared_objects o where o.id=object_id)) with check(user_id=auth.uid() and exists(select 1 from public.shared_objects o where o.id=object_id));
create policy reaction_delete on public.reactions for delete to authenticated using(user_id=auth.uid() and exists(select 1 from public.shared_objects o where o.id=object_id));
create policy question_read on public.question_cards for select to authenticated using(private.is_member(couple_space_id) and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id)));
create policy question_insert on public.question_cards for insert to authenticated with check(private.is_member(couple_space_id) and created_by=auth.uid() and (sensitivity<>'explicit-intimate' or private.intimacy_allowed(couple_space_id)) and (domain<>'faith' or private.faith_allowed(couple_space_id)));
create policy question_update on public.question_cards for update to authenticated using(private.is_member(couple_space_id)) with check(private.is_member(couple_space_id));
create policy response_read on public.question_responses for select to authenticated using(exists(select 1 from public.question_cards q where q.id=question_card_id));
create policy response_insert on public.question_responses for insert to authenticated with check(user_id=auth.uid() and exists(select 1 from public.question_cards q where q.id=question_card_id and q.state='open'));
create policy response_update on public.question_responses for update to authenticated using(user_id=auth.uid() and exists(select 1 from public.question_cards q where q.id=question_card_id and q.state='open')) with check(user_id=auth.uid() and exists(select 1 from public.question_cards q where q.id=question_card_id and q.state='open'));
create policy response_delete on public.question_responses for delete to authenticated using(user_id=auth.uid() and exists(select 1 from public.question_cards q where q.id=question_card_id and q.state='open'));
create policy event_read on public.events for select to authenticated using(private.is_member(couple_space_id));
create policy event_insert on public.events for insert to authenticated with check(private.is_member(couple_space_id) and user_id=auth.uid());

-- Immutable attribution and parent IDs. Only lifecycle status/state columns are granted UPDATE.
revoke all on public.profiles,public.couple_spaces,public.memberships,public.shared_objects,public.reactions,public.question_cards,public.question_responses,public.events from anon,authenticated;
grant select on public.profiles,public.couple_spaces,public.memberships to authenticated;
grant select,insert,delete on public.shared_objects to authenticated;
grant update(status,experienced_at,metadata) on public.shared_objects to authenticated;
grant select,insert,update,delete on public.reactions,public.question_responses to authenticated;
grant select,insert on public.question_cards to authenticated;
grant update(state) on public.question_cards to authenticated;
grant select,insert on public.events to authenticated;

-- Pairing needs privileged membership writes. Each narrow function checks verified identity,
-- locks the user and space, validates adult/shared-space acceptance, and is not exposed as a schema.
create function private.pairing(action text,payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); s uuid; token text; inv private.invites; n integer;
begin
  if u is null then raise exception 'Sign in required' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtext(u::text));
  if action='profile' then
    if payload->>'adult'<>'true' or length(trim(payload->>'display_name')) not between 1 and 60 then raise exception 'Confirm you are an adult'; end if;
    insert into public.profiles(id,display_name,adult_confirmed) values(u,trim(payload->>'display_name'),true) on conflict(id) do update set display_name=excluded.display_name;
    return '{}';
  end if;
  if not exists(select 1 from public.profiles where id=u and adult_confirmed) then raise exception 'Adult confirmation required'; end if;
  select couple_space_id into s from public.memberships where user_id=u and status='active';
  if action='create_space' then
    if payload->>'accepted'<>'true' or s is not null then raise exception 'Already paired or contract not accepted'; end if;
    insert into public.couple_spaces default values returning id into s;
    insert into public.memberships(couple_space_id,user_id) values(s,u);
    return jsonb_build_object('space_id',s);
  elsif action='join' then
    if payload->>'accepted'<>'true' or s is not null then raise exception 'Already paired or contract not accepted'; end if;
    select * into inv from private.invites where token_hash=encode(sha256(convert_to(payload->>'token','UTF8')),'hex') for update;
    if inv.id is null or inv.revoked or inv.used_by is not null or inv.expires_at<=now() then raise exception 'Invite unavailable'; end if;
    perform 1 from public.couple_spaces where id=inv.couple_space_id and state='active' for update;
    if not found then raise exception 'Invite unavailable'; end if;
    select count(*) into n from public.memberships where couple_space_id=inv.couple_space_id and status='active';
    if n<>1 then raise exception 'Invite unavailable'; end if;
    insert into public.memberships(couple_space_id,user_id) values(inv.couple_space_id,u);
    update private.invites set used_by=u where id=inv.id;
    update private.invites set revoked=true where couple_space_id=inv.couple_space_id;
    insert into public.events(couple_space_id,user_id,name) values(inv.couple_space_id,u,'pair_joined');
    return jsonb_build_object('space_id',inv.couple_space_id);
  end if;
  if s is null or not private.is_member(s) then raise exception 'Space unavailable' using errcode='42501'; end if;
  perform 1 from public.couple_spaces where id=s for update;
  if action='invite' then
    if (select count(*) from public.memberships where couple_space_id=s and status='active')<>1 then raise exception 'Space is already paired'; end if;
    update private.invites set revoked=true where couple_space_id=s;
    token:=replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-','');
    insert into private.invites(couple_space_id,token_hash) values(s,encode(sha256(convert_to(token,'UTF8')),'hex'));
    insert into public.events(couple_space_id,user_id,name) values(s,u,'pair_invite_created');
    return jsonb_build_object('token',token,'expires_in_hours',48);
  elsif action='revoke_invite' then
    update private.invites set revoked=true where couple_space_id=s;
  elsif action='settings' then
    update public.memberships set intimacy_enabled=coalesce((payload->>'intimacy_enabled')::boolean,false),faith_enabled=coalesce((payload->>'faith_enabled')::boolean,false) where couple_space_id=s and user_id=u;
  elsif action='leave' then
    if payload->>'confirm'<>'LEAVE' then raise exception 'Explicit confirmation required'; end if;
    -- Closing is symmetric: both lose access immediately. No future partner inherits this home.
    update public.memberships set status='left',left_at=now(),intimacy_enabled=false,faith_enabled=false where couple_space_id=s;
    update public.couple_spaces set state='closed' where id=s;
    update private.invites set revoked=true where couple_space_id=s;
  else raise exception 'Unsupported pairing action';
  end if;
  return '{}';
end $$;

create function public.api_mutate(action text,payload jsonb default '{}') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare s uuid; oid uuid; qid uuid; obj public.shared_objects; card public.question_cards; event_name text;
begin
  if auth.uid() is null then raise exception 'Sign in required' using errcode='42501'; end if;
  if action in ('profile','create_space','join','invite','revoke_invite','settings','leave') then return private.pairing(action,payload); end if;
  select couple_space_id into s from public.memberships where user_id=auth.uid() and status='active';
  if s is null then raise exception 'Space unavailable' using errcode='42501'; end if;
  oid:=nullif(payload->>'id','')::uuid;
  if action='capture' then
    insert into public.shared_objects(couple_space_id,kind,title,body,source_url,source_type,category,sensitivity) values(s,payload->>'kind',trim(payload->>'title'),nullif(payload->>'body',''),nullif(payload->>'source_url',''),case when payload->>'kind'='url' then 'url' else 'manual' end,coalesce(payload->>'category','other'),coalesce(payload->>'sensitivity','ordinary')) returning id into oid;
    event_name:='object_captured';
  elsif action in ('reaction','status','delete_object','decision_selected','enrich') then
    select * into obj from public.shared_objects where id=oid and couple_space_id=s;
    if obj.id is null then raise exception 'Object unavailable' using errcode='42501'; end if;
    if action='reaction' then
      if payload->>'reaction_type'='remove' then delete from public.reactions where object_id=oid and user_id=auth.uid();
      else insert into public.reactions(object_id,user_id,reaction_type) values(oid,auth.uid(),payload->>'reaction_type') on conflict(object_id,user_id) do update set reaction_type=excluded.reaction_type,updated_at=now(); end if;
      event_name:='reaction_set';
    elsif action='status' then
      if obj.sensitivity='explicit-intimate' or obj.category in ('faith','intimacy') then raise exception 'This item does not track completion'; end if;
      update public.shared_objects set status=payload->>'status',experienced_at=case when payload->>'status'='done' then now() else null end where id=oid;
      if payload->>'status'='done' then event_name:='object_completed'; end if;
    elsif action='delete_object' then
      if obj.created_by<>auth.uid() then raise exception 'Only the contributor can delete this item' using errcode='42501'; end if;
      delete from public.shared_objects where id=oid;
    elsif action='decision_selected' then
      if obj.sensitivity<>'ordinary' or obj.category in ('faith','intimacy') or obj.status not in ('saved','considering') then raise exception 'Candidate unavailable'; end if;
      update public.shared_objects set status='considering' where id=oid;
      event_name:='decision_candidate_selected';
    elsif action='enrich' then
      if obj.sensitivity<>'ordinary' then raise exception 'Sensitive content is not enriched'; end if;
      update public.shared_objects set metadata=jsonb_build_object('source',left(payload->>'source',253),'confidence',1,'enrichment','source_preserved') where id=oid;
    end if;
  elsif action='question' then
    insert into public.question_cards(couple_space_id,prompt,domain,sensitivity,prompt_source) values(s,trim(payload->>'prompt'),payload->>'domain',payload->>'sensitivity',payload->>'prompt_source') returning id into oid;
    event_name:='question_card_created';
  elsif action in ('response','archive_question') then
    qid:=oid;
    select * into card from public.question_cards where id=qid and couple_space_id=s;
    if card.id is null then raise exception 'Question unavailable' using errcode='42501'; end if;
    if action='archive_question' then update public.question_cards set state='archived' where id=qid;
    else
      if card.state<>'open' then raise exception 'This card is archived'; end if;
      if payload->>'state'='unanswered' then delete from public.question_responses where question_card_id=qid and user_id=auth.uid();
      else
        insert into public.question_responses(question_card_id,user_id,state,answer) values(qid,auth.uid(),payload->>'state',case when payload->>'state'='answered' then trim(payload->>'answer') else null end) on conflict(question_card_id,user_id) do update set state=excluded.state,answer=excluded.answer,updated_at=now();
        event_name:=case payload->>'state' when 'answered' then 'question_card_answered' when 'passed' then 'question_card_passed' when 'not_now' then 'question_card_not_now' end;
      end if;
    end if;
  else raise exception 'Unsupported action';
  end if;
  if event_name is not null then insert into public.events(couple_space_id,name) values(s,event_name); end if;
  return jsonb_build_object('id',oid);
end $$;

create function private.pilot_enabled() returns boolean
language sql stable security definer set search_path='' as $$
  select auth.uid() is not null and intimacy_pilot from private.features where singleton;
$$;

-- Projection avoids sensitive bodies, source URLs, and answers in collection/network previews.
create function public.api_snapshot() returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object(
    'user',jsonb_build_object('id',auth.uid(),'display_name',coalesce((select display_name from public.profiles where id=auth.uid()),'')),
    'space',(select jsonb_build_object('id',s.id,'created_at',s.created_at) from public.couple_spaces s join public.memberships m on m.couple_space_id=s.id where m.user_id=auth.uid() and m.status='active'),
    'members',coalesce((select jsonb_agg(jsonb_build_object('user_id',m.user_id,'display_name',p.display_name,'intimacy_enabled',m.intimacy_enabled,'faith_enabled',m.faith_enabled)) from public.memberships m join public.profiles p on p.id=m.user_id where m.status='active'),'[]'),
    'objects',coalesce((select jsonb_agg(jsonb_build_object('id',o.id,'created_by',o.created_by,'created_at',o.created_at,'kind',o.kind,'title',case when o.sensitivity='ordinary' then o.title else 'Something shared between you' end,'body',case when o.sensitivity='ordinary' then o.body else null end,'source_url',case when o.sensitivity='ordinary' then o.source_url else null end,'category',o.category,'status',o.status,'sensitivity',o.sensitivity,'hidden',o.sensitivity<>'ordinary','metadata',case when o.sensitivity='ordinary' then o.metadata else '{}'::jsonb end,'reactions',coalesce((select jsonb_agg(jsonb_build_object('user_id',r.user_id,'reaction_type',r.reaction_type)) from public.reactions r where r.object_id=o.id),'[]')) order by o.created_at desc) from public.shared_objects o),'[]'),
    'questions',coalesce((select jsonb_agg(jsonb_build_object('id',q.id,'created_by',q.created_by,'created_at',q.created_at,'prompt',case when q.sensitivity='ordinary' then q.prompt else 'A question for just the two of you' end,'domain',q.domain,'sensitivity',q.sensitivity,'state',q.state,'prompt_source',q.prompt_source,'hidden',q.sensitivity<>'ordinary','responses',coalesce((select jsonb_agg(jsonb_build_object('user_id',r.user_id,'state',r.state,'answer',case when q.sensitivity='ordinary' then r.answer else null end)) from public.question_responses r where r.question_card_id=q.id),'[]')) order by q.created_at desc) from public.question_cards q),'[]'),
    'intimacy_available',private.pilot_enabled(),
    'intimacy_active',coalesce((select private.intimacy_allowed(m.couple_space_id) from public.memberships m where m.user_id=auth.uid() and m.status='active'),false),
    'faith_active',coalesce((select private.faith_allowed(m.couple_space_id) from public.memberships m where m.user_id=auth.uid() and m.status='active'),false)
  ) where auth.uid() is not null;
$$;

create function public.api_detail(object_id uuid,object_type text) returns jsonb
language sql stable security invoker set search_path='' as $$
  select case when object_type='object' then
    (select to_jsonb(o)||jsonb_build_object('hidden',false,'reactions',coalesce((select jsonb_agg(jsonb_build_object('user_id',r.user_id,'reaction_type',r.reaction_type)) from public.reactions r where r.object_id=o.id),'[]')) from public.shared_objects o where o.id=object_id)
  when object_type='question' then
    (select to_jsonb(q)||jsonb_build_object('hidden',false,'responses',coalesce((select jsonb_agg(jsonb_build_object('user_id',r.user_id,'state',r.state,'answer',r.answer)) from public.question_responses r where r.question_card_id=q.id),'[]')) from public.question_cards q where q.id=object_id)
  end where auth.uid() is not null;
$$;

revoke all on all functions in schema private from public;
grant execute on function private.is_member(uuid),private.intimacy_allowed(uuid),private.faith_allowed(uuid),private.pilot_enabled(),private.pairing(text,jsonb) to authenticated;
revoke all on function public.api_mutate(text,jsonb),public.api_snapshot(),public.api_detail(uuid,text) from public;
grant execute on function public.api_mutate(text,jsonb),public.api_snapshot(),public.api_detail(uuid,text) to authenticated;
-- Deliberately no anonymous access, service key, storage bucket, or public link to couple content.
