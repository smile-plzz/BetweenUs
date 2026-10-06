import { z } from "zod";
import { requireUser, AppError } from "@/server/auth";
import { snapshot } from "@/server/service";
import { discoverIdeas } from "@/server/discovery";
import { failure, json } from "@/server/http";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    if (!(await snapshot(user)).space)
      throw new AppError("Create or join your shared space first.", 403);
    const params = new URL(request.url).searchParams;
    const input = z
      .object({ intent: z.enum(["watch", "eat", "do"]) })
      .strict()
      .parse(Object.fromEntries(params));
    return json(await discoverIdeas(input.intent));
  } catch (e) {
    return failure(e);
  }
}
