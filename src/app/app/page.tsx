"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import "./app.css";
import type { ConnectedPage } from "@/lib/types";
import {
  loadPages,
  savePages,
  sortPages,
  createPage,
  resetPages,
} from "@/lib/client-storage";
import { newId } from "@/lib/id";

type ConnectFormState = {
  name: string;
  sourceUrl: string;
  html: string;
};

const SUGGESTIONS = [
  "В блоке для Германии у Stripe замени 49€ на 59€",
  "March → April",
  "В тарифе Pro для USA замени $54 на $64",
  "Spring Conference 2026 → Summit 2026",
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function pluralize(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "версия";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "версии";
  return "версий";
}

export default function AppPage() {
  const [pages, setPagesState] = useState<ConnectedPage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [previewMode, setPreviewMode] = useState<"after" | "before">("after");
  const [showConnect, setShowConnect] = useState(false);
  const [connectForm, setConnectForm] = useState<ConnectFormState>({
    name: "",
    sourceUrl: "",
    html: "",
  });
  const [toast, setToast] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => pages.find((p) => p.id === selectedId) ?? null,
    [pages, selectedId]
  );

  const persist = useCallback((updater: ConnectedPage[] | ((prev: ConnectedPage[]) => ConnectedPage[])) => {
    setPagesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const sorted = sortPages(next);
      savePages(sorted);
      return sorted;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => {
    const initial = sortPages(loadPages());
    setPagesState(initial);
    if (initial.length > 0) setSelectedId(initial[0].id);
    setHydrated(true);
  }, []);

  useEffect(() => {
    setSuccessSummary(null);
    setPreviewMode("after");
  }, [selectedId]);

  const updatePage = useCallback(
    (id: string, mutator: (p: ConnectedPage) => ConnectedPage) => {
      persist((prev) => prev.map((p) => (p.id === id ? mutator(p) : p)));
    },
    [persist]
  );

  const handleApply = useCallback(async () => {
    if (!selected || !prompt.trim()) return;
    setApplying(true);
    setSuccessSummary(null);
    try {
      const baseHtml = selected.draftHtml ?? selected.publishedHtml;
      const res = await fetch("/api/apply-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: baseHtml,
          prompt,
          imageDataUrl: imageDataUrl ?? undefined,
        }),
      });
      const data = (await res.json()) as
        | { ok: true; html: string; summary: string }
        | { ok: false; error: string };

      const now = new Date().toISOString();
      if (data.ok) {
        updatePage(selected.id, (p) => ({
          ...p,
          draftHtml: data.html,
          draftPrompt: prompt,
          draftError: null,
          updatedAt: now,
        }));
        setSuccessSummary(data.summary);
        setImageDataUrl(null);
        setImageName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setPreviewMode("after");
      } else {
        updatePage(selected.id, (p) => ({
          ...p,
          draftError: data.error,
          draftPrompt: prompt,
          updatedAt: now,
        }));
      }
    } catch {
      showToast("Сервер не отвечает");
    } finally {
      setApplying(false);
    }
  }, [selected, prompt, imageDataUrl, updatePage, showToast]);

  const handlePublish = useCallback(() => {
    if (!selected || !selected.draftHtml) return;
    const now = new Date().toISOString();
    updatePage(selected.id, (p) => ({
      ...p,
      versions: [
        {
          id: newId("v"),
          prompt: p.draftPrompt ?? "(без описания)",
          html: p.draftHtml!,
          publishedAt: now,
        },
        ...p.versions,
      ],
      publishedHtml: p.draftHtml!,
      draftHtml: null,
      draftPrompt: null,
      draftError: null,
      updatedAt: now,
    }));
    setPrompt("");
    setSuccessSummary(null);
    showToast("Опубликовано на прод");
  }, [selected, updatePage, showToast]);

  const handleDiscard = useCallback(() => {
    if (!selected) return;
    updatePage(selected.id, (p) => ({
      ...p,
      draftHtml: null,
      draftPrompt: null,
      draftError: null,
      updatedAt: new Date().toISOString(),
    }));
    setPrompt("");
    setSuccessSummary(null);
    showToast("Драфт сброшен");
  }, [selected, updatePage, showToast]);

  const handleRollback = useCallback(
    (versionId: string) => {
      if (!selected) return;
      const target = selected.versions.find((v) => v.id === versionId);
      if (!target) return;
      const now = new Date().toISOString();
      updatePage(selected.id, (p) => ({
        ...p,
        versions: [
          {
            id: newId("v"),
            prompt: `↩ Откат на версию от ${target.publishedAt}`,
            html: target.html,
            publishedAt: now,
          },
          ...p.versions,
        ],
        publishedHtml: target.html,
        draftHtml: null,
        draftPrompt: null,
        draftError: null,
        updatedAt: now,
      }));
      showToast("Версия восстановлена");
    },
    [selected, updatePage, showToast]
  );

  const handleConnect = useCallback(() => {
    if (!connectForm.html.trim()) {
      showToast("Вставьте HTML страницы");
      return;
    }
    const created = createPage(connectForm);
    persist((prev) => [created, ...prev]);
    setSelectedId(created.id);
    setShowConnect(false);
    setConnectForm({ name: "", sourceUrl: "", html: "" });
    showToast("Страница подключена");
  }, [connectForm, persist, showToast]);

  const handleResetDemo = useCallback(() => {
    const seeded = sortPages(resetPages());
    setPagesState(seeded);
    if (seeded.length > 0) setSelectedId(seeded[0].id);
    showToast("Демо сброшено");
  }, [showToast]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const previewHtml =
    selected?.draftHtml && previewMode === "after"
      ? selected.draftHtml
      : selected?.publishedHtml ?? "";

  if (!hydrated) {
    return (
      <main>
        <nav className="app-nav">
          <div className="app-nav-left">
            <Link href="/" className="app-logo">
              tildra<span style={{ color: "var(--accent)", fontStyle: "normal" }}>/</span>
            </Link>
          </div>
        </nav>
      </main>
    );
  }

  return (
    <main>
      <nav className="app-nav">
        <div className="app-nav-left">
          <Link href="/" className="app-logo">
            tildra<span style={{ color: "var(--accent)", fontStyle: "normal" }}>/</span>
          </Link>
          <span className="app-breadcrumb">// рабочий стол</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={handleResetDemo}
            title="Сбросить демо к исходному состоянию"
          >
            ↺ Сброс демо
          </button>
          <button className="btn btn-primary" onClick={() => setShowConnect(true)}>
            + Подключить страницу
          </button>
        </div>
      </nav>

      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-head">
            <span>// страницы · {pages.length}</span>
          </div>
          {pages.length === 0 ? (
            <div className="sidebar-empty">
              нет подключённых страниц.
              <br />
              нажми «+ подключить»
            </div>
          ) : (
            <div className="sidebar-list">
              {pages.map((p) => (
                <button
                  key={p.id}
                  className={`page-item ${p.id === selectedId ? "active" : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div className="page-item-name">
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </span>
                    {p.draftHtml && <span className="draft-dot" title="есть драфт" />}
                  </div>
                  <div className="page-item-meta">
                    {p.sourceUrl ? safeHostname(p.sourceUrl) : "локальный HTML"} ·
                    v{p.versions.length}
                  </div>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="main">
          {!selected ? (
            <div className="main-empty">
              <h2>
                Выбери <em style={{ color: "var(--accent)" }}>страницу</em>
              </h2>
              <p>
                Слева — список подключённых страниц. Подключи свою через
                «Подключить страницу» — вставь ссылку или HTML.
              </p>
            </div>
          ) : (
            <>
              <div className="page-header">
                <div>
                  <h1>{selected.name}</h1>
                  <div className="page-source">
                    {selected.sourceUrl ?? "локальный HTML · без источника"}
                  </div>
                </div>
                <div className="page-actions">
                  {selected.draftHtml ? (
                    <>
                      <span className="page-status draft">драфт готов</span>
                      <button className="btn btn-ghost" onClick={handleDiscard}>
                        Сбросить
                      </button>
                      <button className="btn btn-primary" onClick={handlePublish}>
                        Опубликовать →
                      </button>
                    </>
                  ) : (
                    <span className="page-status">опубликовано</span>
                  )}
                </div>
              </div>

              <div className="editor">
                <div className="editor-form">
                  <div className="editor-label">
                    // опиши правку — формат «X → Y» или «поменяй X на Y»
                  </div>
                  <textarea
                    className="prompt-input"
                    placeholder="Например: в блоке для Германии у Stripe замени 49€ на 59€"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="editor-suggestions">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        className="suggestion"
                        onClick={() => setPrompt(s)}
                        type="button"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="editor-controls">
                  <label className={`upload ${imageDataUrl ? "has-image" : ""}`}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f);
                      }}
                    />
                    📎{" "}
                    {imageName
                      ? imageName.length > 16
                        ? imageName.slice(0, 14) + "…"
                        : imageName
                      : "Картинка (опц.)"}
                  </label>
                  <button
                    className="btn btn-primary"
                    onClick={handleApply}
                    disabled={applying || !prompt.trim()}
                  >
                    {applying ? (
                      <>
                        <span className="spinner" /> Применяю…
                      </>
                    ) : (
                      "Применить →"
                    )}
                  </button>
                </div>
              </div>

              {selected.draftError && (
                <div className="draft-error">{selected.draftError}</div>
              )}
              {!selected.draftError && successSummary && selected.draftHtml && (
                <div className="draft-success">{successSummary}</div>
              )}

              <div className="preview-wrap">
                <div className="preview-bar">
                  <div className="preview-bar-left">
                    <div className="preview-toggle">
                      <button
                        className={previewMode === "before" ? "active" : ""}
                        onClick={() => setPreviewMode("before")}
                        disabled={!selected.draftHtml}
                      >
                        было
                      </button>
                      <button
                        className={previewMode === "after" ? "active" : ""}
                        onClick={() => setPreviewMode("after")}
                      >
                        {selected.draftHtml ? "стало (драфт)" : "опубликовано"}
                      </button>
                    </div>
                    <span className="preview-label">
                      // превью на тестовой странице
                    </span>
                  </div>
                </div>
                <div className="preview-frame-wrap">
                  <iframe
                    className="preview-frame"
                    title="preview"
                    srcDoc={previewHtml}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>

              <div className="history">
                <h2>История версий</h2>
                <div className="history-sub">
                  // {selected.versions.length} {pluralize(selected.versions.length)} ·
                  откат за один клик
                </div>
                {selected.versions.map((v, idx) => (
                  <div className="version" key={v.id}>
                    <div className="version-time">{formatTime(v.publishedAt)}</div>
                    <div className="version-prompt">
                      {idx === 0 && <span className="version-tag">актуальная</span>}
                      {v.prompt}
                    </div>
                    {idx === 0 ? (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
                        текущая
                      </span>
                    ) : (
                      <button
                        className="btn btn-ghost"
                        onClick={() => handleRollback(v.id)}
                      >
                        ↩ Откатить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {showConnect && (
        <div className="modal-backdrop" onClick={() => setShowConnect(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              Подключить <em>страницу</em>
            </h2>
            <p className="modal-sub">
              Вставь HTML опубликованной Tilda-страницы. Можно указать ссылку — она
              сохранится как метка источника.
            </p>
            <div className="field">
              <label>Название (для удобства)</label>
              <input
                type="text"
                placeholder="Лендинг клиента ABC"
                value={connectForm.name}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, name: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Ссылка на опубликованную страницу (опц.)</label>
              <input
                type="url"
                placeholder="https://my-client.tilda.ws/pricing"
                value={connectForm.sourceUrl}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, sourceUrl: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>HTML страницы *</label>
              <textarea
                placeholder="<!DOCTYPE html>..."
                value={connectForm.html}
                onChange={(e) =>
                  setConnectForm({ ...connectForm, html: e.target.value })
                }
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setShowConnect(false)}
              >
                Отмена
              </button>
              <button className="btn btn-primary" onClick={handleConnect}>
                Подключить →
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "ссылка";
  }
}
