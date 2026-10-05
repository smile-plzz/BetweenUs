import { after } from "next/server";
import { mutation } from "@/domain/validation";
import { enrichLocally, classifySource } from "@/domain/intelligence";
import { requireUser } from "@/server/auth";
import { mutate, snapshot } from "@/server/service";
import { checkOrigin, failure, json, readBody } from "@/server/http";
export async function GET() {
  try {
    return json(await snapshot(await requireUser()));
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const user = await requireUser();
    const input = mutation.parse(await readBody(request));
    const payload =
      input.action === "capture" &&
      input.category === "other" &&
      input.sensitivity === "ordinary"
        ? { ...input, category: classifySource(input.source_url) }
        : input;
    const result = await mutate(user, input.action, payload);
    // Commit succeeded before metadata work is scheduled. No fetch/AI, including for sensitive text.
    if (
      input.action === "capture" &&
      input.sensitivity === "ordinary" &&
      input.source_url &&
      result.id
    ) {
      const sourceUrl = input.source_url,
        id = result.id;
      after(async () => {
        try {
          const meta = await enrichLocally(sourceUrl);
          await mutate(user, "enrich", { id, source: meta.source });
        } catch {
          /* saved original survives; do not log content */
        }
      });
    }
    return json(result);
  } catch (e) {
    return failure(e);
  }
}
