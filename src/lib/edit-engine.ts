import { EditResult } from "./types";

type ContextFilters = {
  country?: string;
  operator?: string;
  plan?: string;
  matchedPhrases: string[];
};

const COUNTRY_MAP: Record<string, string[]> = {
  Germany: ["Германии", "Германия", "Germany", "🇩🇪"],
  USA: ["США", "USA", "Америки", "Америка"],
  Russia: ["России", "Россия", "Russia", "🇷🇺"],
};

const OPERATOR_TOKENS = ["Stripe", "YooKassa", "ЮKassa", "Юкасса"];
const PLAN_TOKENS = ["Basic", "Pro", "Enterprise"];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripQuotes(s: string): string {
  return s.replace(/^["'«»\s]+|["'«»\s.,;:!?]+$/g, "").trim();
}

function extractContext(prompt: string): ContextFilters {
  const matched: string[] = [];
  let country: string | undefined;
  for (const [iso, tokens] of Object.entries(COUNTRY_MAP)) {
    for (const t of tokens) {
      const re = new RegExp(escapeRegex(t), "i");
      if (re.test(prompt)) {
        country = iso;
        matched.push(t);
        break;
      }
    }
    if (country) break;
  }
  let operator: string | undefined;
  for (const t of OPERATOR_TOKENS) {
    const re = new RegExp(`\\b${escapeRegex(t)}\\b`, "i");
    if (re.test(prompt)) {
      operator = t;
      matched.push(t);
      break;
    }
  }
  let plan: string | undefined;
  for (const t of PLAN_TOKENS) {
    const re = new RegExp(`\\b${escapeRegex(t)}\\b`, "i");
    if (re.test(prompt)) {
      plan = t;
      matched.push(t);
      break;
    }
  }
  return { country, operator, plan, matchedPhrases: matched };
}

function stripContextWithPrepositions(prompt: string, matchedPhrases: string[]): string {
  let stripped = prompt;
  for (const phrase of matchedPhrases) {
    const wrapRe = new RegExp(
      `(?:в\\s+блоке\\s+(?:цен\\s+)?(?:для\\s+)?|в\\s+тарифе\\s+|для\\s+|у\\s+оператора\\s+|у\\s+)?${escapeRegex(
        phrase
      )}`,
      "gi"
    );
    stripped = stripped.replace(wrapRe, "");
  }
  stripped = stripped.replace(/\s+/g, " ").trim();
  return stripped;
}

function parseFromTo(
  prompt: string,
  context: ContextFilters
): { from: string; to: string } | null {
  const stripped = stripContextWithPrepositions(prompt, context.matchedPhrases);

  const arrowMatch = stripped.match(/^(.*?)\s*(?:→|->|—>|⟶|=>)\s*(.+?)$/);
  if (arrowMatch && arrowMatch[1].trim() && arrowMatch[2].trim()) {
    return { from: stripQuotes(arrowMatch[1]), to: stripQuotes(arrowMatch[2]) };
  }

  const verbPatterns: RegExp[] = [
    /(?:поменяй|замени(?:ть)?|обнови(?:ть)?)\s+(?:цену\s+|дату\s+|месяц\s+|текст\s+)?["'«]?(.+?)["'»]?\s+на\s+["'«]?(.+?)["'»]?$/i,
    /(?:change|replace|update)\s+(?:price\s+|date\s+|text\s+)?["']?(.+?)["']?\s+to\s+["']?(.+?)["']?$/i,
  ];
  for (const re of verbPatterns) {
    const m = stripped.match(re);
    if (m && m[1].trim() && m[2].trim()) {
      return { from: stripQuotes(m[1]), to: stripQuotes(m[2]) };
    }
  }

  const naMatch = stripped.match(/^(.+?)\s+(?:на|to)\s+(.+?)$/i);
  if (naMatch && naMatch[1].trim() && naMatch[2].trim()) {
    return { from: stripQuotes(naMatch[1]), to: stripQuotes(naMatch[2]) };
  }

  return null;
}

function findCountryBlock(
  html: string,
  country: string
): { start: number; end: number; text: string } | null {
  const re = new RegExp(
    `<div class="country-block" data-country="${escapeRegex(country)}"[\\s\\S]*?</div>\\s*</div>`,
    "i"
  );
  const m = html.match(re);
  if (!m || m.index === undefined) return null;
  return { start: m.index, end: m.index + m[0].length, text: m[0] };
}

function isInPlanBlock(html: string, index: number, plan: string): boolean {
  const before = html.slice(0, index);
  const planStart = before.lastIndexOf('<div class="plan');
  if (planStart < 0) return false;
  const planSegment = html.slice(planStart, index + 200);
  const headingMatch = planSegment.match(/<h3[^>]*>([^<]+)<\/h3>/i);
  if (!headingMatch) return false;
  return headingMatch[1].toLowerCase().includes(plan.toLowerCase());
}

function isNearOperator(html: string, index: number, operator: string): boolean {
  const window = html.slice(
    Math.max(0, index - 800),
    Math.min(html.length, index + 800)
  );
  return window.toLowerCase().includes(operator.toLowerCase());
}

function applyTextReplace(
  html: string,
  prompt: string
): EditResult {
  const context = extractContext(prompt);
  const parsed = parseFromTo(prompt, context);
  if (!parsed) {
    return {
      ok: false,
      error:
        "Не понял правку. Используйте формат «X → Y» или «поменяй X на Y» — например: «49€ → 59€» или «март → апрель».",
    };
  }

  let scopeStart = 0;
  let scopedHtml = html;

  if (context.country) {
    const block = findCountryBlock(html, context.country);
    if (!block) {
      return {
        ok: false,
        error: `Не нашёл блок страны «${context.country}». Уберите страну из промпта или проверьте написание.`,
      };
    }
    scopeStart = block.start;
    scopedHtml = block.text;
  }

  const findRe = new RegExp(escapeRegex(parsed.from), "g");
  const matches: { index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = findRe.exec(scopedHtml)) !== null) {
    matches.push({ index: m.index, length: m[0].length });
    if (m.index === findRe.lastIndex) findRe.lastIndex++;
  }

  if (matches.length === 0) {
    return {
      ok: false,
      error: `Не нашёл «${parsed.from}»${
        context.country ? ` в блоке ${context.country}` : ""
      }. Проверьте написание (валюта, пробелы, регистр).`,
    };
  }

  let filtered = matches;
  if (context.operator) {
    filtered = filtered.filter((mm) =>
      isNearOperator(scopedHtml, mm.index, context.operator!)
    );
  }
  if (context.plan) {
    filtered = filtered.filter((mm) =>
      isInPlanBlock(scopedHtml, mm.index, context.plan!)
    );
  }

  if (filtered.length === 0) {
    const ctxBits = [context.operator, context.plan].filter(Boolean).join(" / ");
    return {
      ok: false,
      error: `Нашёл «${parsed.from}», но не в контексте «${ctxBits}». Уточните или уберите фильтр.`,
    };
  }

  if (filtered.length > 1) {
    const hints: string[] = [];
    if (!context.country) hints.push("страну (Germany / USA / Russia)");
    if (!context.operator) hints.push("оператора (Stripe / YooKassa)");
    if (!context.plan) hints.push("тариф (Basic / Pro / Enterprise)");
    return {
      ok: false,
      error: `Нашёл ${filtered.length} мест с «${parsed.from}» на странице. Уточните ${
        hints.length > 0 ? hints.join(", ") : "контекст"
      }.`,
    };
  }

  const hit = filtered[0];
  const absoluteIndex = scopeStart + hit.index;
  const newHtml =
    html.slice(0, absoluteIndex) +
    parsed.to +
    html.slice(absoluteIndex + hit.length);

  const ctxLabel =
    [context.country, context.operator, context.plan].filter(Boolean).join(" · ") ||
    "вся страница";

  return {
    ok: true,
    html: newHtml,
    summary: `Заменил «${parsed.from}» → «${parsed.to}» (${ctxLabel}).`,
  };
}

function applyImageEdit(
  html: string,
  prompt: string,
  imageDataUrl: string
): EditResult {
  const imgs: { index: number; tag: string; src: string; alt: string }[] = [];
  const re = /<img\s[^>]*?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const srcMatch = tag.match(/src="([^"]*)"/);
    const altMatch = tag.match(/alt="([^"]*)"/);
    imgs.push({
      index: m.index,
      tag,
      src: srcMatch ? srcMatch[1] : "",
      alt: altMatch ? altMatch[1] : "",
    });
  }

  if (imgs.length === 0) {
    return { ok: false, error: "На странице не найдено изображений." };
  }

  const lower = prompt.toLowerCase();
  let target: (typeof imgs)[number] | undefined;

  if (imgs.length === 1) {
    target = imgs[0];
  } else if (
    /(?:hero|главн|первую|первая|first|перв(ую|ая|ое|ый))/i.test(lower)
  ) {
    target = imgs[0];
  } else if (/(?:последн|last)/i.test(lower)) {
    target = imgs[imgs.length - 1];
  } else {
    const numMatch = lower.match(/(?:№|#|номер\s*)(\d+)|(\d+)\s*(?:ю|ую|ой|ое)/);
    if (numMatch) {
      const n = parseInt(numMatch[1] || numMatch[2], 10);
      if (n >= 1 && n <= imgs.length) target = imgs[n - 1];
    } else {
      for (const img of imgs) {
        if (img.alt && lower.includes(img.alt.toLowerCase())) {
          target = img;
          break;
        }
      }
    }
  }

  if (!target) {
    return {
      ok: false,
      error: `На странице ${imgs.length} изображений. Уточните: «замени hero-картинку», «замени картинку №N» или укажите alt-текст.`,
    };
  }

  const newTag = target.tag.replace(/src="[^"]*"/, `src="${imageDataUrl}"`);
  const newHtml =
    html.slice(0, target.index) +
    newTag +
    html.slice(target.index + target.tag.length);

  return {
    ok: true,
    html: newHtml,
    summary: `Заменил изображение${target.alt ? ` «${target.alt}»` : ""}.`,
  };
}

export function applyEdit(
  html: string,
  prompt: string,
  imageDataUrl?: string
): EditResult {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return { ok: false, error: "Промпт пустой — опишите, что нужно изменить." };
  }

  if (imageDataUrl) {
    return applyImageEdit(html, trimmed, imageDataUrl);
  }

  return applyTextReplace(html, trimmed);
}
