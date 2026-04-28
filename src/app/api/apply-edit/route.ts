import { NextRequest, NextResponse } from "next/server";
import { applyEdit } from "@/lib/edit-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

const MAX_HTML_SIZE = 2_000_000;
const MAX_PROMPT_SIZE = 4_000;
const MAX_IMAGE_DATA_URL_SIZE = 8_000_000;

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 12_000_000) {
    return NextResponse.json(
      { ok: false, error: "Запрос слишком большой." },
      { status: 413 }
    );
  }

  let body: {
    html?: string;
    prompt?: string;
    imageDataUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Невалидный JSON." },
      { status: 400 }
    );
  }

  if (typeof body.html !== "string" || !body.html.trim()) {
    return NextResponse.json(
      { ok: false, error: "Не передан HTML страницы." },
      { status: 400 }
    );
  }
  if (body.html.length > MAX_HTML_SIZE) {
    return NextResponse.json(
      { ok: false, error: "HTML слишком большой (>2 МБ)." },
      { status: 413 }
    );
  }
  if (typeof body.prompt !== "string") {
    return NextResponse.json(
      { ok: false, error: "Поле prompt должно быть строкой." },
      { status: 400 }
    );
  }
  if (body.prompt.length > MAX_PROMPT_SIZE) {
    return NextResponse.json(
      { ok: false, error: "Промпт слишком длинный (>4 000 символов)." },
      { status: 413 }
    );
  }
  if (
    body.imageDataUrl !== undefined &&
    (typeof body.imageDataUrl !== "string" ||
      body.imageDataUrl.length > MAX_IMAGE_DATA_URL_SIZE ||
      !body.imageDataUrl.startsWith("data:image/"))
  ) {
    return NextResponse.json(
      { ok: false, error: "Неподдерживаемый формат картинки или слишком большой файл." },
      { status: 413 }
    );
  }

  const result = applyEdit(body.html, body.prompt, body.imageDataUrl);
  return NextResponse.json(result);
}
