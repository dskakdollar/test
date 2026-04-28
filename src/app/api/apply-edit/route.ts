import { NextRequest, NextResponse } from "next/server";
import { applyEdit } from "@/lib/edit-engine";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    html?: string;
    prompt?: string;
    imageDataUrl?: string;
  };

  if (!body.html) {
    return NextResponse.json(
      { ok: false, error: "Не передан HTML страницы." },
      { status: 400 }
    );
  }

  const result = applyEdit(body.html, body.prompt ?? "", body.imageDataUrl);
  return NextResponse.json(result);
}
