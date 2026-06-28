import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main>
      {/* Hero */}
      <section className="relative text-center py-24 px-4">
        <div className="absolute inset-0 bg-gradient-radial from-amber-400/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-amber-400/60 text-sm tracking-[0.2em] mb-4">{dict.home.heroTag}</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {dict.home.heroTitle1}
            <br />
            <span className="text-amber-400">{dict.home.heroTitle2}</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">{dict.home.heroDesc}</p>
          <div className="flex gap-4 justify-center">
            <Link href={`/${lang}/reading`} className="btn-glow text-sm">{dict.home.cta1}</Link>
            <Link href={`/${lang}/daily`} className="btn-glow bg-white/5 text-white hover:bg-white/10 shadow-none text-sm">{dict.home.cta2}</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
        {[
          { title: dict.home.service1Title, desc: dict.home.service1Desc, price: dict.home.service1Price, href: `/${lang}/reading` },
          { title: dict.home.service2Title, desc: dict.home.service2Desc, price: dict.home.service2Price, href: `/${lang}/naming` },
          { title: dict.home.service3Title, desc: dict.home.service3Desc, price: dict.home.service3Price, href: `/${lang}/daily` },
        ].map((svc, i) => (
          <Link key={i} href={svc.href} className="card group hover:border-amber-400/20 transition-all">
            <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{svc.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{svc.desc}</p>
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-bold">{svc.price}</span>
              <span className="text-amber-400/50 text-sm group-hover:translate-x-1 transition-transform">{dict.home.learnMore}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Systems */}
      <section className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">{dict.home.systemsTitle}</h2>
        <p className="text-gray-400 text-sm mb-10 max-w-xl mx-auto">{dict.home.systemsDesc}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: dict.home.sys1Name, desc: dict.home.sys1Desc, icon: "🌙" },
            { name: dict.home.sys2Name, desc: dict.home.sys2Desc, icon: "⭐" },
            { name: dict.home.sys3Name, desc: dict.home.sys3Desc, icon: "🏯" },
            { name: dict.home.sys4Name, desc: dict.home.sys4Desc, icon: "🌍" },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <p className="text-2xl mb-2">{s.icon}</p>
              <p className="font-bold mb-1">{s.name}</p>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-3">{dict.home.ctaTitle}</h2>
        <p className="text-gray-400 mb-6">{dict.home.ctaDesc}</p>
        <Link href={`/${lang}/reading`} className="btn-glow inline-block">{dict.home.ctaBtn}</Link>
      </section>
    </main>
  );
}
