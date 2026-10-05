import { NextResponse } from "next/server";
import { supabase } from "@/server/auth";
import { mutate } from "@/server/service";
export async function GET(request: Request) {
  const url = new URL(request.url),
    code = url.searchParams.get("code");
  if (code) {
    const client = await supabase();
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const meta = data.user.user_metadata;
      if (meta.adult_confirmed && meta.display_name)
        await mutate(data.user.id, "profile", {
          display_name: String(meta.display_name).slice(0, 60),
          adult: true,
        });
      return NextResponse.redirect(
        new URL("/", process.env.APP_ORIGIN || url.origin),
      );
    }
  }
  return NextResponse.redirect(
    new URL("/?auth=failed", process.env.APP_ORIGIN || url.origin),
  );
}
