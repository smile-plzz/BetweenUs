import { PGlite } from '@electric-sql/pglite';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
interface LocalState { db: Promise<PGlite>; queue: Promise<unknown> }
const globalDB = globalThis as typeof globalThis & { betweenusLocal?: LocalState };
export function localMode() {
  const backend=process.env.BETWEENUS_BACKEND;
  if(backend!=='local' && backend!=='supabase') throw new Error('Choose BETWEENUS_BACKEND=local or supabase. See .env.example.');
  if(backend==='local' && process.env.VERCEL) throw new Error('Local mode is not supported on Vercel. Configure Supabase.');
  return backend==='local';
}
async function initialize() {
  const path=resolve(process.env.LOCAL_DATABASE_PATH || '.local/betweenus');
  await mkdir(path,{recursive:true});
  const db=new PGlite(path);
  await db.waitReady;
  const exists=await db.query<{present:boolean}>("select exists(select 1 from pg_namespace where nspname='local_auth') as present");
  if(!exists.rows[0].present) {
    await db.transaction(async tx=>{
      await tx.exec(await readFile(resolve('db/local-bootstrap.sql'),'utf8'));
      await tx.exec(await readFile(resolve('db/schema.sql'),'utf8'));
    });
  }
  await db.query('update private.features set intimacy_pilot=$1 where singleton',[process.env.ENABLE_INTIMACY_PILOT==='true']);
  return db;
}
export async function withLocal<T>(fn:(db:PGlite)=>Promise<T>):Promise<T> {
  globalDB.betweenusLocal ??= {db:initialize(),queue:Promise.resolve()};
  const state=globalDB.betweenusLocal;
  const result=state.queue.then(async()=>fn(await state.db));
  state.queue=result.catch(()=>undefined);
  return result;
}
export async function localRPC<T>(userId:string, name:'api_snapshot'|'api_mutate'|'api_detail',args:unknown[]=[]):Promise<T> {
  return withLocal(db=>db.transaction(async tx=>{
    await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[userId]);
    await tx.exec('set local role authenticated');
    const params=args.map((_,i)=>`$${i+1}`).join(',');
    const result=await tx.query<{result:T}>(`select public.${name}(${params}) as result`,args);
    return result.rows[0].result;
  }));
}
