import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

export default async function SuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🔮</div>
      <h1 className="text-3xl font-bold mb-4">{dict.success.title}</h1>
      <p className="text-gray-400 mb-3">{dict.success.subtitle1}</p>
      <p className="text-gray-500 text-sm mb-8">
        {dict.success.subtitle2}<br />
        {dict.success.subtitle3}
      </p>
      <div className="card mb-8">
        <p className="text-amber-400 text-sm">{dict.success.notice}</p>
      </div>
      <Link href={`/${lang}`} className="text-amber-400 hover:underline">
        {dict.success.back}
      </Link>
    </main>
  );
}
