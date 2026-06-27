import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "命师BKing | AI Fortune Lab — 东西方双系统命理",
  description: "BaZi · ZiWei · QiMen · Western Astrology — AI-powered cross-system fortune analysis. 八字·紫微·奇门·占星 四套系统交叉验证",
  keywords: "bazi, astrology, chinese metaphysics, fortune telling, 八字, 命理, 占星",
  openGraph: {
    title: "命师BKing | AI Fortune Lab",
    description: "东西方双系统命理分析 · East meets West Fortune Analysis",
    url: "https://bking-fortune.com",
    siteName: "命师BKing",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="text-amber-400">命师</span>BKing
              <span className="text-xs text-gray-500 ml-2 hidden sm:inline">| AI Fortune Lab</span>
            </a>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/reading" className="hover:text-amber-400 transition-colors">命盘解读</a>
              <a href="/naming" className="hover:text-amber-400 transition-colors">起名</a>
              <a href="/daily" className="hover:text-amber-400 transition-colors">每日运势</a>
              <a href="/blog" className="hover:text-amber-400 transition-colors">Blog</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-white/10 bg-black/50 mt-20 py-8 text-center text-sm text-gray-600">
          <p>© 2026 命师BKing · AI Fortune Lab · 东西方双系统命理</p>
          <p className="mt-1">BaZi · ZiWei · QiMen · Western Astrology — Powered by AI</p>
        </footer>
      </body>
    </html>
  );
}
