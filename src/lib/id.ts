export function newId(prefix = ""): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const ts = Date.now().toString(36);
  return `${prefix}${prefix ? "-" : ""}${ts}-${rand}`;
}
