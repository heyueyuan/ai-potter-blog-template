import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as { secret?: string; path?: string };

  const secretFromQuery = url.searchParams.get("secret");
  const secret = secretFromQuery || body.secret || "";
  const expected = process.env.REVALIDATE_SECRET || "";

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const path = body.path || "/";
  revalidatePath(path);
  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: path });
}
