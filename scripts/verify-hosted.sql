-- Run as postgres in a dedicated Supabase pilot SQL editor, after the migration.
-- Synthetic identities/content only. Everything, including auth users, is rolled back.
-- This checks real PostgreSQL roles/RLS, not email delivery or browser sessions.
begin;
create temporary table betweenus_smoke_actors as
select gen_random_uuid() as a, gen_random_uuid() as b, gen_random_uuid() as c;
grant select on betweenus_smoke_actors to authenticated;
insert into auth.users(id)
select a from betweenus_smoke_actors union all
select b from betweenus_smoke_actors union all
select c from betweenus_smoke_actors;
set local role authenticated;
do $$
declare
  actors record;
  space_id uuid;
  item_id uuid;
  discreet_id uuid;
  question_id uuid;
  token text;
  denied boolean;
  s jsonb;
begin
  select * into actors from betweenus_smoke_actors;
  perform set_config('request.jwt.claim.sub', actors.a::text, true);
  perform public.api_mutate('profile', '{"display_name":"Synthetic A","adult":true}');
  space_id := (public.api_mutate('create_space', '{"accepted":true}')->>'space_id')::uuid;
  token := public.api_mutate('invite', '{}')->>'token';
  item_id := (public.api_mutate('capture', '{"kind":"note","title":"Hosted ordinary fixture","category":"watch","sensitivity":"ordinary"}')->>'id')::uuid;
  discreet_id := (public.api_mutate('capture', '{"kind":"note","title":"Discreet fixture title","body":"Discreet fixture body","category":"other","sensitivity":"private-couple"}')->>'id')::uuid;
  question_id := (public.api_mutate('question', '{"prompt":"Hosted voluntary question","domain":"everyday","sensitivity":"ordinary","prompt_source":"custom"}')->>'id')::uuid;
  perform set_config('betweenus.smoke.space', space_id::text, true);

  perform set_config('request.jwt.claim.sub', actors.b::text, true);
  perform public.api_mutate('profile', '{"display_name":"Synthetic B","adult":true}');
  perform public.api_mutate('join', jsonb_build_object('token',token,'accepted',true));
  s := public.api_snapshot();
  if (s->'space'->>'id')::uuid is distinct from space_id or jsonb_array_length(s->'members') is distinct from 2 then
    raise exception 'FAIL: B did not enter A shared space';
  end if;
  if public.api_detail(item_id,'object')->>'title' is distinct from 'Hosted ordinary fixture' then
    raise exception 'FAIL: capture unavailable to B';
  end if;
  if s::text like '%Discreet fixture%' then
    raise exception 'FAIL: discreet content leaked in snapshot';
  end if;
  if public.api_detail(discreet_id,'object')->>'body' is distinct from 'Discreet fixture body' then
    raise exception 'FAIL: authorized discreet detail unavailable';
  end if;
  perform public.api_mutate('reaction',jsonb_build_object('id',item_id,'reaction_type','love'));
  perform public.api_mutate('response',jsonb_build_object('id',question_id,'state','answered','answer','Synthetic shared answer'));
  perform public.api_mutate('response',jsonb_build_object('id',question_id,'state','passed'));
  if not exists(select 1 from public.question_responses where question_card_id=question_id and user_id=actors.b and state='passed' and answer is null) then
    raise exception 'FAIL: Pass retained answer or lost participant state';
  end if;
  perform public.api_mutate('response',jsonb_build_object('id',question_id,'state','not_now'));
  perform public.api_mutate('response',jsonb_build_object('id',question_id,'state','unanswered'));
  if exists(select 1 from public.question_responses where question_card_id=question_id and user_id=actors.b) then
    raise exception 'FAIL: unanswered retained response';
  end if;

  denied := false;
  begin
    insert into public.reactions(object_id,user_id,reaction_type) values(item_id,actors.a,'love');
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'FAIL: actor spoofing allowed'; end if;

  perform set_config('request.jwt.claim.sub', actors.a::text, true);
  if not exists(select 1 from public.reactions where object_id=item_id and user_id=actors.b and reaction_type='love') then
    raise exception 'FAIL: partner reaction unavailable to A';
  end if;
  denied := false;
  begin
    perform public.api_mutate('question','{"prompt":"Synthetic intimate fixture","domain":"intimacy","sensitivity":"explicit-intimate","prompt_source":"custom"}');
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'FAIL: intimacy available with installation disabled'; end if;

  perform set_config('request.jwt.claim.sub', actors.c::text, true);
  perform public.api_mutate('profile', '{"display_name":"Synthetic C","adult":true}');
  perform public.api_mutate('create_space', '{"accepted":true}');
  if public.api_detail(item_id,'object') is not null or public.api_detail(discreet_id,'object') is not null then
    raise exception 'FAIL: C accessed guessed object IDs';
  end if;
  if exists(select 1 from public.shared_objects where couple_space_id=space_id) then
    raise exception 'FAIL: cross-space table read allowed';
  end if;
  denied := false;
  begin
    perform public.api_mutate('reaction',jsonb_build_object('id',item_id,'reaction_type','love'));
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'FAIL: cross-space reaction allowed'; end if;
end $$;
reset role;
do $$
declare denied boolean := false; actors record;
begin
  select * into actors from betweenus_smoke_actors;
  begin
    insert into public.memberships(couple_space_id,user_id)
    values(current_setting('betweenus.smoke.space')::uuid,actors.c);
  exception when check_violation then denied := true;
  end;
  if not denied then raise exception 'FAIL: privileged write exceeded two members'; end if;
end $$;
set local role anon;
do $$
declare denied boolean := false;
begin
  begin perform public.api_snapshot();
  exception when insufficient_privilege then denied := true;
  end;
  if not denied then raise exception 'FAIL: anonymous snapshot execution allowed'; end if;
end $$;
reset role;
select 'PASS: hosted role/RLS smoke; all synthetic data rolled back' as result;
rollback;
