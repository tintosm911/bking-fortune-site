import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-amber-400 text-sm tracking-widest mb-4">EAST × WEST · CROSS ANALYSIS</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          东西方双系统<span className="text-amber-400">命理分析</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          BaZi · ZiWei · QiMen · Western Astrology — 
          四套系统交叉验证，AI 驱动，让你的命盘前所未有地清晰
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/reading" className="btn-glow">🔮 立即解锁命盘</Link>
          <Link href="/daily" className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-lg transition-colors">
            📅 今日运势
          </Link>
        </div>
      </section>

      {/* 服务卡片 */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: "🔮",
            title: "命盘解读",
            desc: "八字 + 紫微斗数 + 奇门遁甲 + 西方占星，四套系统交叉验证，深度解读你的命格走势",
            price: "$9.99",
            href: "/reading",
          },
          {
            icon: "🎋",
            title: "起名改名",
            desc: "基于八字五行补益 + 五格数理 + 三才配置，科学起名，帮你补上命盘短板",
            price: "$19.99",
            href: "/naming",
          },
          {
            icon: "📅",
            title: "每日运势",
            desc: "12星座 + 生肖 + 奇门综合研判，每日吉凶早知道，把握天时地利",
            price: "免费 / $5月",
            href: "/daily",
          },
        ].map((svc, i) => (
          <div key={i} className="card hover:border-amber-400/30 transition-all group">
            <div className="text-4xl mb-4">{svc.icon}</div>
            <h3 className="text-xl font-bold mb-2">{svc.title}</h3>
            <p className="text-gray-400 text-sm mb-4 flex-1">{svc.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-amber-400 font-bold">{svc.price}</span>
              <Link href={svc.href} className="text-sm text-gray-500 group-hover:text-amber-400 transition-colors">
                了解更多 →
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 系统介绍 */}
      <section className="border-t border-white/10 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">四套系统 · 交叉验证</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            单系统容易偏颇，双系统才见真章。我们用东方三套 + 西方一套，互相印证，给出准确度最高的解读
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🌙", name: "八字命理", desc: "天干地支·十神格局", eng: "BaZi" },
              { icon: "⭐", name: "紫微斗数", desc: "十二宫位·星曜分布", eng: "ZiWei" },
              { icon: "🏯", name: "奇门遁甲", desc: "时空方位·格局吉凶", eng: "QiMen" },
              { icon: "🌍", name: "西方占星", desc: "行星相位·宫位解读", eng: "Astrology" },
            ].map((s, i) => (
              <div key={i} className="card text-center">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                <p className="text-xs text-amber-400/60 mt-1">{s.eng}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="card border-amber-400/20">
          <h2 className="text-2xl font-bold mb-3">准备好看到真实的自己了吗？</h2>
          <p className="text-gray-400 mb-6">输入出生日期，免费预览你的八字和星座速览</p>
          <Link href="/reading" className="btn-glow inline-block">🔮 开始解读</Link>
        </div>
      </section>
    </main>
  );
}
