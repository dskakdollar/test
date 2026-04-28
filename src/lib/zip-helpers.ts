"use client";

import JSZip from "jszip";

export type ZipPageEntry = {
  path: string;
  name: string;
  html: string;
  size: number;
};

export async function readZipPages(file: File | Blob): Promise<{
  zip: JSZip;
  entries: ZipPageEntry[];
}> {
  const zip = await JSZip.loadAsync(file);
  const entries: ZipPageEntry[] = [];

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    if (!path.toLowerCase().endsWith(".html")) continue;
    const html = await entry.async("string");
    const size = html.length;
    const segments = path.split("/");
    const name = segments[segments.length - 1].replace(/\.html$/i, "");
    entries.push({ path, name, html, size });
  }

  entries.sort((a, b) => {
    if (a.path.toLowerCase().endsWith("index.html")) return -1;
    if (b.path.toLowerCase().endsWith("index.html")) return 1;
    return a.path.localeCompare(b.path);
  });

  return { zip, entries };
}

export async function repackageZip(
  originalZip: Blob,
  pagePath: string,
  newHtml: string
): Promise<Blob> {
  const zip = await JSZip.loadAsync(originalZip);
  zip.file(pagePath, newHtml);
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
