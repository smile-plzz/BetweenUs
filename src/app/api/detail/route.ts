import { z } from 'zod';
import { requireUser } from '@/server/auth';
import { rpc } from '@/server/service';
import { failure, json } from '@/server/http';
export async function GET(request:Request) {
  try {
    const params=new URL(request.url).searchParams;
    const object_id=z.uuid().parse(params.get('id')),object_type=z.enum(['object','question']).parse(params.get('type'));
    const data=await rpc(await requireUser(),'api_detail',{object_id,object_type});
    return data?json(data):json({error:'This content is unavailable.'},404);
  }catch(e){return failure(e);}
}
