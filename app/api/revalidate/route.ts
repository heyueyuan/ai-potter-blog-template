import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as { secret?: string; path?: string };

  const expected = process.env.REVALIDATE_SECRET || "";
  if (expected) {
    const secretFromQuery = url.searchParams.get("secret");
    const secret = secretFromQuery || body.secret || "";
    if (secret !== expected) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const path = body.path || "/";
  revalidatePath(path);
  revalidatePath("/");
  return NextResponse.json({ ok: true, revalidated: path });
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "POST to this endpoint to trigger ISR." });
}
