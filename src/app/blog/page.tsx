import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      title: "什么是八字？10分钟入门",
      desc: "天干地支、五行生克、十神格局 —— 从零开始读懂你的八字命盘",
      date: "2026-06-25",
      slug: "#",
    },
    {
      title: "东西方命理对比：星座和八字哪个更准？",
      desc: "用同一个人的命盘同时跑八字和占星两个系统，结果出人意料",
      date: "2026-06-24",
      slug: "#",
    },
    {
      title: "真太阳时是什么？你的出生时辰可能算错了",
      desc: "北京时间不是你的真太阳时。差一度经度，时辰可能就变了",
      date: "2026-06-23",
      slug: "#",
    },
    {
      title: "2026下半年12星座运势全解析",
      desc: "火象握权、水象沉淀、风象转型、土象爆发 —— 你的星座下半年怎么走",
      date: "2026-06-22",
      slug: "#",
    },
    {
      title: "天蝎座+甲木日主=什么样的命？",
      desc: "东方日主甲木配上西方太阳天蝎，两种系统的解读竟然如此一致",
      date: "2026-06-20",
      slug: "#",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">📝 Blog</h1>
      <p className="text-center text-gray-400 mb-10">
        八字 · 占星 · 奇门 · 紫微 —— 东西方命理知识库
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <Link key={i} href={post.slug} className="card group hover:border-amber-400/30 transition-all">
            <p className="text-xs text-gray-600 mb-2">{post.date}</p>
            <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-gray-400">{post.desc}</p>
            <p className="text-amber-400/60 text-sm mt-3 group-hover:text-amber-400 transition-colors">
              阅读更多 →
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/reading" className="btn-glow text-sm">
          🔮 想看更多？先解读你的命盘
        </Link>
      </div>
    </main>
  );
}
