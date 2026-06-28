import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "命师BKing | AI Fortune Lab",
  description: "BaZi · ZiWei · QiMen · Western Astrology — AI 驱动四套系统交叉验证命理分析平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">{children}</body>
    </html>
  );
}
