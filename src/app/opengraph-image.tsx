import { ImageResponse } from "next/og";

export const alt = "Tildra — AI-редактор Tilda для фрилансеров";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0d0e0c 0%, #15171a 60%, #0d0e0c 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px 90px",
          color: "#f3eee2",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontStyle: "italic",
            color: "#f3eee2",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#d9ff1a",
              boxShadow: "0 0 24px #d9ff1a",
            }}
          />
          tildra<span style={{ color: "#d9ff1a", fontStyle: "normal" }}>/</span>
        </div>

        <div
          style={{
            marginTop: 80,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#d9ff1a",
            fontFamily: "monospace",
          }}
        >
          AI-редактор Tilda для фрилансеров
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 86,
            lineHeight: 1,
            letterSpacing: -3,
            fontWeight: 400,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>
            Закрывай пакеты правок
          </span>
          <span>
            клиентов в{" "}
            <span style={{ fontStyle: "italic", color: "#d9ff1a" }}>5×</span>{" "}
            быстрее.
          </span>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#c9c3b3",
            fontFamily: "monospace",
            letterSpacing: 1,
          }}
        >
          <span>цены · даты · картинки — одной фразой</span>
          <span style={{ color: "#6b6a64" }}>↗ tildra</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
