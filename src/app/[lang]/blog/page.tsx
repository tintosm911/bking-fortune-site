import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">{dict.blog.title}</h1>
      <p className="text-center text-gray-400 mb-10">{dict.blog.subtitle}</p>

      <div className="grid md:grid-cols-2 gap-6">
        {dict.blog.posts.map((post, i) => (
          <Link key={i} href="#" className="card group hover:border-amber-400/30 transition-all">
            <p className="text-xs text-gray-600 mb-2">{post.date}</p>
            <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400">{post.desc}</p>
            <p className="text-amber-400/60 text-sm mt-3 group-hover:text-amber-400 transition-colors">
              {dict.blog.readMore}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href={`/${lang}/reading`} className="btn-glow text-sm">
          {dict.blog.cta}
        </Link>
      </div>
    </main>
  );
}
