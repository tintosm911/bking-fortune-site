import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

export default async function DailyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const dirLabel = lang === "zh" ? dict.daily.directionVal : dict.daily.directionVal;
  const timeLabel = lang === "zh" ? dict.daily.timeVal : dict.daily.timeVal;
  const colorLabel = lang === "zh" ? dict.daily.colorVal : dict.daily.colorVal;

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-2">{dict.daily.title}</h1>
      <p className="text-gray-400 mb-10">{dict.daily.subtitle}</p>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-amber-400 mb-3">{dict.daily.today}</h2>
        <p className="text-gray-400 mb-6">{dict.daily.todayDesc}</p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          {[
            { icon: "🌅", label: dict.daily.direction, value: dirLabel },
            { icon: "✨", label: dict.daily.time, value: timeLabel },
            { icon: "🎨", label: dict.daily.color, value: colorLabel },
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
        <h3 className="font-bold mb-3">{dict.daily.member}</h3>
        <p className="text-sm text-gray-400 mb-4">{dict.daily.memberDesc}</p>
        <Link href={`/${lang}/reading`} className="btn-glow inline-block text-sm">
          {dict.daily.memberBtn}
        </Link>
      </div>
    </main>
  );
}
