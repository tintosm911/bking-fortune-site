"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChartSummary {
  id: string;
  name: string;
  birth: string;
  gender: string;
  city: string;
  createdAt: string;
  preview: string;
}

interface OrderSummary {
  id: string;
  product: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage({ params: { lang } }: { params: { lang: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [charts, setCharts] = useState<ChartSummary[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${lang}/auth/login`);
      return;
    }
    if (status === "authenticated") {
      fetch("/api/chart?mine=1")
        .then((r) => r.json())
        .then((d) => {
          if (d.charts) setCharts(d.charts);
          if (d.orders) setOrders(d.orders);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status, lang, router]);

  if (status === "loading" || loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">
        {lang === "zh" ? "加载中..." : "Loading..."}
      </main>
    );
  }

  const isZh = lang === "zh";

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">
        📊 {isZh ? "我的控制台" : "Dashboard"}
      </h1>
      <p className="text-gray-400 mb-8">
        {isZh ? `欢迎回来，${session?.user?.name || ""}` : `Welcome back, ${session?.user?.name || ""}`}
      </p>

      {/* Charts Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            🔮 {isZh ? "我的命盘" : "My Charts"}
          </h2>
          <a href={`/${lang}/reading`} className="text-amber-400 text-sm hover:underline">
            + {isZh ? "新建解读" : "New Reading"}
          </a>
        </div>

        {charts.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            <p className="text-2xl mb-3">🌙</p>
            <p>{isZh ? "还没有命盘，去解读一个吧" : "No charts yet. Get your first reading!"}</p>
            <a href={`/${lang}/reading`} className="btn-glow inline-block mt-4 text-sm">
              {isZh ? "🔮 立即解读" : "🔮 Start Reading"}
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {charts.map((c) => (
              <div key={c.id} className="card hover:border-amber-400/20 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold">{c.name || (isZh ? "未命名" : "Unknown")}</h3>
                    <p className="text-xs text-gray-500">
                      {c.birth} · {c.gender === "male" ? (isZh ? "男" : "M") : (isZh ? "女" : "F")}
                      {c.city ? ` · ${c.city}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-400 font-mono">{c.preview}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Orders Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          💰 {isZh ? "我的订单" : "My Orders"}
        </h2>
        {orders.length === 0 ? (
          <div className="card text-center py-6 text-gray-500 text-sm">
            {isZh ? "暂无订单" : "No orders yet"}
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => {
              const productLabels: Record<string, string> = {
                reading: isZh ? "命盘解读" : "Chart Reading",
                naming: isZh ? "起名服务" : "Naming",
                naming_premium: isZh ? "至尊起名" : "Premium Naming",
                subscription: isZh ? "月度会员" : "Subscription",
              };
              return (
                <div key={o.id} className="card flex justify-between items-center">
                  <div>
                    <span className="font-medium">{productLabels[o.product] || o.product}</span>
                    <span className={`ml-3 text-xs px-2 py-0.5 rounded ${o.status === "paid" ? "bg-green-400/10 text-green-400" : "bg-gray-400/10 text-gray-400"}`}>
                      {o.status === "paid" ? (isZh ? "已支付" : "Paid") : o.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">${o.amount}</span>
                    <p className="text-xs text-gray-600">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
