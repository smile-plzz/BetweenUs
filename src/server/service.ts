import type { Snapshot } from '@/domain/model';
import { localMode, localRPC } from './local-db';
import { AppError, supabase } from './auth';
export async function rpc<T>(userId:string,name:'api_snapshot'|'api_mutate'|'api_detail',args:Record<string,unknown>={}):Promise<T> {
  if(localMode()) {
    const values=name==='api_mutate'?[args.action,args.payload]:name==='api_detail'?[args.object_id,args.object_type]:[];
    return localRPC<T>(userId,name,values);
  }
  const {data,error}=await (await supabase()).rpc(name,args);
  if(error) throw new AppError(error.code==='42501'?'This content is unavailable.':'The change could not be saved. Check your space and try again.',error.code==='42501'?403:400);
  return data as T;
}
export function snapshot(userId:string) {return rpc<Snapshot>(userId,'api_snapshot');}
export function mutate(userId:string,action:string,payload:Record<string,unknown>) {return rpc<{id?:string;token?:string}>(userId,'api_mutate',{action,payload});}
