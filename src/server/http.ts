import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./auth";
export function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store", Vary: "Cookie" },
  });
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expected)
    throw new AppError("This request came from another site.", 403);
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new AppError("JSON required.", 415);
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 16384)
    throw new AppError("This entry is too long.", 413);
  try {
    return JSON.parse(raw);
  } catch {
    throw new AppError("Invalid request.", 400);
  }
}
export function failure(error: unknown) {
  if (error instanceof AppError)
    return json({ error: error.message }, error.status);
  if (error instanceof ZodError)
    return json(
      { error: error.issues[0]?.message || "Check the fields." },
      400,
    );
  // Never log exceptions from Postgres: constraint details can contain intimate row data.
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);
    if (["42501", "23514", "23505", "P0001"].includes(code))
      return json(
        {
          error:
            "This change is unavailable. Check pairing, participation settings, or the item state.",
        },
        400,
      );
  }
  return json(
    {
      error:
        "Something could not be completed. Your saved things are safe. Try again.",
    },
    500,
  );
}
