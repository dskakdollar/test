export type Version = {
  id: string;
  prompt: string;
  html: string;
  publishedAt: string;
};

export type ConnectedPage = {
  id: string;
  name: string;
  sourceUrl: string | null;
  publishedHtml: string;
  draftHtml: string | null;
  draftPrompt: string | null;
  draftError: string | null;
  versions: Version[];
  createdAt: string;
  updatedAt: string;
  zipPath?: string | null;
  zipFilename?: string | null;
};

export type Database = {
  pages: ConnectedPage[];
};

export type EditResult =
  | { ok: true; html: string; summary: string }
  | { ok: false; error: string };
