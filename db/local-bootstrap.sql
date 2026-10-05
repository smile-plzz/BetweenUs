-- Local-only auth shim. Not applied to Supabase, which supplies auth.users/auth.uid().
create role authenticated nologin;
create role anon nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
grant usage on schema auth,public to authenticated;
grant execute on function auth.uid() to authenticated;
create schema local_auth;
create table local_auth.accounts (id uuid primary key references auth.users(id), email text unique not null, password_hash text not null, salt text not null);
create table local_auth.sessions (token_hash text primary key, user_id uuid not null references local_auth.accounts(id), expires_at timestamptz not null);
create table local_auth.attempts (key text primary key, count integer not null, reset_at timestamptz not null);
