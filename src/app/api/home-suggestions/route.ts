import { requireUser, AppError } from "@/server/auth";
import { snapshot } from "@/server/service";
import { discoverIdeas } from "@/server/discovery";
import { failure, json } from "@/server/http";

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    if (!(await snapshot(user)).space)
      throw new AppError("Create or join your shared space first.", 403);
    if (new URL(request.url).search)
      throw new AppError("This request does not accept personal context.");
    const now = new Date();
    const results = await Promise.all([
      discoverIdeas("watch", now),
      discoverIdeas("do", now),
    ]);
    return json({
      ideas: results
        .filter((r) => r.origin === "public_catalog")
        .flatMap((r) => r.ideas),
      checked_at: now.toISOString(),
    });
  } catch (error) {
    return failure(error);
  }
}
