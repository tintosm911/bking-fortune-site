import Link from "next/link";

export default function DailyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-2">📅 每日运势</h1>
      <p className="text-gray-400 mb-10">
        12星座 + 生肖 + 奇门综合 · 每日免费更新
      </p>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-amber-400 mb-3">今日运势</h2>
        <p className="text-gray-400 mb-6">每日一签 · 吉凶早知道 · 把握天时地利</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { icon: "🌅", label: "吉方", value: "东方" },
            { icon: "✨", label: "吉时", value: "辰时·午时" },
            { icon: "🎨", label: "吉色", value: "绿色·蓝色" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-gray-500">{item.label}</p>
              <p className="font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-3">💎 会员专属</h3>
        <p className="text-sm text-gray-400 mb-4">
          $5/月 解锁：12星座个性化日运 · 生肖专属运势 · 每月综合报告
        </p>
        <Link href="/reading" className="btn-glow inline-block text-sm">
          开始解读 → 订阅会员
        </Link>
      </div>
    </main>
  );
}
