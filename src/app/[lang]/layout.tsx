import type { Metadata } from "next";
import "../globals.css";
import { getDictionary, Lang } from "@/i18n/dictionaries";
import { LangSwitcher } from "@/components/LangSwitcher";
import { SessionProvider } from "@/components/SessionProvider";
import { UserMenu } from "@/components/UserMenu";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return {
    title: dict.site.title,
    description: dict.site.description,
    keywords: "bazi, astrology, chinese metaphysics, fortune telling",
    openGraph: {
      title: dict.site.title,
      description: dict.site.description,
      url: `https://www.bking.one/${lang}`,
      siteName: dict.site.brand,
      type: "website",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return (
    <html lang={lang === "zh" ? "zh-CN" : "en"}>
      <body className="min-h-screen bg-[#0a0a0f] text-white antialiased">
        <SessionProvider>
          <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
              <a href={`/${lang}`} className="text-xl font-bold tracking-tight">
                <span className="text-amber-400">{dict.site.brand}</span>
                <span className="text-xs text-gray-500 ml-2 hidden sm:inline">| {dict.site.tagline}</span>
              </a>
              <div className="flex gap-4 sm:gap-6 items-center text-sm text-gray-400">
                <a href={`/${lang}/reading`} className="hover:text-amber-400 transition-colors">{dict.nav.reading}</a>
                <a href={`/${lang}/naming`} className="hover:text-amber-400 transition-colors">{dict.nav.naming}</a>
                <a href={`/${lang}/daily`} className="hover:text-amber-400 transition-colors">{dict.nav.daily}</a>
                <a href={`/${lang}/blog`} className="hover:text-amber-400 transition-colors">{dict.nav.blog}</a>
                <UserMenu lang={lang} />
                <LangSwitcher currentLang={lang} />
              </div>
            </div>
          </nav>
          {children}
          <footer className="border-t border-white/10 bg-black/50 mt-20 py-8 text-center text-sm text-gray-600">
            <p>{dict.site.footer}</p>
            <p className="mt-1">{dict.site.footerSub}</p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
