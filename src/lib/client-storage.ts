"use client";

import { ConnectedPage } from "./types";
import { seedPages } from "./seed";
import { newId } from "./id";

const KEY = "tildra:pages:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPages(): ConnectedPage[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    const seeded = seedPages();
    window.localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as ConnectedPage[];
  } catch {
    const seeded = seedPages();
    window.localStorage.setItem(KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function savePages(pages: ConnectedPage[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(pages));
}

export function resetPages(): ConnectedPage[] {
  if (!isBrowser()) return [];
  const seeded = seedPages();
  window.localStorage.setItem(KEY, JSON.stringify(seeded));
  return seeded;
}

export function sortPages(pages: ConnectedPage[]): ConnectedPage[] {
  return [...pages].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createPage(input: {
  name?: string;
  sourceUrl?: string;
  html: string;
}): ConnectedPage {
  const id = newId("page");
  const now = new Date().toISOString();
  return {
    id,
    name: input.name?.trim() || `Страница ${id.slice(0, 6)}`,
    sourceUrl: input.sourceUrl?.trim() || null,
    publishedHtml: input.html,
    draftHtml: null,
    draftPrompt: null,
    draftError: null,
    versions: [
      {
        id: newId("v"),
        prompt: "Initial connected version",
        html: input.html,
        publishedAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}
