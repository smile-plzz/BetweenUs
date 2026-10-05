import { authInput } from '@/domain/validation';
import { AppError, localAuthenticate, logout, supabase } from '@/server/auth';
import { localMode } from '@/server/local-db';
import { mutate } from '@/server/service';
import { checkOrigin, failure, json, readBody } from '@/server/http';
export async function POST(request:Request) {
  try {
    checkOrigin(request);
    const input=authInput.parse(await readBody(request));
    if(input.action==='logout'){await logout();return json({ok:true});}
    if(!input.email||!input.password) throw new AppError('Email and a password of at least 12 characters are required.');
    if(input.action==='signup'&&(!input.adult||!input.display_name)) throw new AppError('Confirm you are 18 or older and choose a name.');
    let id:string;
    if(localMode()) id=await localAuthenticate(input.action,input.email,input.password);
    else {
      const client=await supabase();
      const result=input.action==='signup'
        ? await client.auth.signUp({email:input.email,password:input.password,options:{emailRedirectTo:`${process.env.APP_ORIGIN}/auth/callback`,data:{display_name:input.display_name,adult_confirmed:input.adult}}})
        : await client.auth.signInWithPassword({email:input.email,password:input.password});
      if(result.error) throw new AppError('Unable to sign in or create this account. Check your email and password.');
      if(!result.data.session) return json({confirmation:true});
      id=result.data.user!.id;
      if(input.action==='login') {
        const {data}=await client.auth.getUser();
        if(data.user?.user_metadata.adult_confirmed && data.user?.user_metadata.display_name) {
          await mutate(id,'profile',{display_name:String(data.user.user_metadata.display_name).slice(0,60),adult:true});
        }
      }
    }
    if(input.action==='signup') await mutate(id,'profile',{display_name:input.display_name,adult:true});
    return json({ok:true});
  }catch(e){return failure(e);}
}
