import type { Metadata } from "next";
import { Manrope, Spectral, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const serif = Spectral({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tildra — AI-редактор Tilda для фрилансеров",
  description:
    "Закрывай пакеты правок клиентов в 5× быстрее. Просто открываешь — одна правка за раз, всё остальное за тебя.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} ${serif.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
