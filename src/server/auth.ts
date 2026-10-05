import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { localMode, withLocal } from './local-db';
export class AppError extends Error { constructor(message:string,public status=400){super(message);} }
const hash=(value:string)=>createHash('sha256').update(value).digest('hex');
export async function supabase() {
  const jar=await cookies();
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) throw new AppError('Supabase configuration is missing.',503);
  return createServerClient(url,key,{cookies:{getAll:()=>jar.getAll(),setAll:values=>values.forEach(({name,value,options})=>jar.set(name,value,{...options,httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'}))}});
}
export async function currentUser():Promise<string|null> {
  if(!localMode()) {
    const client=await supabase(); const {data,error}=await client.auth.getUser();
    if(error) return null;
    return data.user?.id||null;
  }
  const token=(await cookies()).get('betweenus_session')?.value;
  if(!token) return null;
  return withLocal(async db=>{
    const r=await db.query<{user_id:string}>('select user_id from local_auth.sessions where token_hash=$1 and expires_at>now()',[hash(token)]);
    return r.rows[0]?.user_id||null;
  });
}
export async function requireUser() { const u=await currentUser(); if(!u) throw new AppError('Please sign in.',401); return u; }
export async function localAuthenticate(action:'signup'|'login',email:string,password:string) {
  const normalized=email.trim().toLowerCase();
  const userId=await withLocal(async db=>db.transaction(async tx=>{
    // Persistent bounded attempts, scoped to email; do not trust client-provided actor IDs.
    const key=hash(normalized);
    const limits=await tx.query<{count:number}>("insert into local_auth.attempts(key,count,reset_at) values($1,1,now()+interval '15 minutes') on conflict(key) do update set count=case when local_auth.attempts.reset_at<now() then 1 else local_auth.attempts.count+1 end,reset_at=case when local_auth.attempts.reset_at<now() then now()+interval '15 minutes' else local_auth.attempts.reset_at end returning count",[key]);
    if(limits.rows[0].count>20) return {error:'Too many attempts. Try again in 15 minutes.'};
    const r=await tx.query<{id:string;password_hash:string;salt:string}>('select * from local_auth.accounts where email=$1',[normalized]);
    if(action==='signup') {
      if(r.rows.length) return {error:'Unable to create this account. Try signing in.'};
      const id=randomUUID(),salt=randomBytes(16).toString('hex');
      const passwordHash=scryptSync(password,salt,64).toString('hex');
      await tx.query('insert into auth.users(id) values($1)',[id]);
      await tx.query('insert into local_auth.accounts(id,email,password_hash,salt) values($1,$2,$3,$4)',[id,normalized,passwordHash,salt]);
      return {id};
    }
    const account=r.rows[0];
    const attempt=scryptSync(password,account?.salt||'missing-account-salt',64);
    if(!account||!timingSafeEqual(attempt,Buffer.from(account.password_hash,'hex'))) return {error:'Email or password was not recognized.'};
    return {id:account.id};
  }));
  if('error' in userId) throw new AppError(userId.error!,400);
  const token=randomBytes(32).toString('hex');
  await withLocal(db=>db.query("insert into local_auth.sessions(token_hash,user_id,expires_at) values($1,$2,now()+interval '7 days')",[hash(token),userId.id]));
  (await cookies()).set('betweenus_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*86400});
  return userId.id!;
}
export async function logout() {
  if(!localMode()) { await (await supabase()).auth.signOut({scope:'local'}); return; }
  const jar=await cookies(); const token=jar.get('betweenus_session')?.value;
  if(token) await withLocal(db=>db.query('delete from local_auth.sessions where token_hash=$1',[hash(token)]));
  jar.delete('betweenus_session');
}
