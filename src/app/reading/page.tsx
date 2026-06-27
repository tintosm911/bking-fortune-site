"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface ChartPreview {
  bazi: string;
  dayMaster: string;
  sunSign: string;
  moonSign: string;
  ascSign: string;
  wuxing: Record<string, number>;
  elementBalance: string;
}

export default function ReadingPage() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ChartPreview | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    birth: "",
    time: "12:00",
    gender: "男",
    city: "北京",
  });

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          birth: form.birth,
          time: form.time,
          gender: form.gender,
          city: form.city,
          preview: true,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPreview(data);
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          birth: form.birth,
          time: form.time,
          gender: form.gender,
          city: form.city,
          product: "reading",
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("创建支付链接失败");
      }
    } catch {
      setError("支付服务暂时不可用");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">
        🔮 命盘解读
      </h1>
      <p className="text-center text-gray-400 mb-10">
        免费预览八字 + 星座速览 · 付费解锁完整四套系统深度解读
      </p>

      {/* 输入表单 */}
      <form onSubmit={handlePreview} className="card max-w-lg mx-auto mb-8">
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">姓名</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="你的姓名"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">出生日期</label>
            <input
              type="date"
              value={form.birth}
              onChange={(e) => setForm({ ...form, birth: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">时间 (可选)</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">性别</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>男</option>
                <option>女</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">出生城市 (可选)</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="如：北京、上海、天津"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-glow w-full">
            {loading ? "分析中..." : "🔍 免费预览命盘"}
          </button>
        </div>
      </form>

      {/* 预览结果 */}
      {preview && (
        <div className="card max-w-lg mx-auto mb-8 border-amber-400/20">
          <h2 className="text-xl font-bold mb-4 text-amber-400">
            📊 {form.name || "你"} 的命盘速览
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">八字</span>
              <p className="font-mono text-lg">{preview.bazi}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">日主</span>
              <p className="font-mono text-lg">{preview.dayMaster}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">太阳星座</span>
              <p className="text-lg">{preview.sunSign}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">月亮星座</span>
              <p className="text-lg">{preview.moonSign}</p>
            </div>
          </div>

          {/* 五行图 */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">五行分布</span>
            <div className="flex gap-2 mt-2 h-6">
              {["金","木","水","火","土"].map((wx) => {
                const cnt = preview.wuxing?.[wx] || 0;
                const colors: Record<string, string> = { 金: "bg-yellow-400", 木: "bg-green-400", 水: "bg-blue-400", 火: "bg-red-400", 土: "bg-amber-600" };
                return (
                  <div key={wx} className="flex-1 bg-white/5 rounded relative overflow-hidden" title={`${wx}: ${cnt}`}>
                    <div className={`absolute bottom-0 w-full rounded ${colors[wx] || "bg-gray-400"}`} style={{ height: `${Math.min(cnt * 20, 100)}%` }} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{wx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {preview.elementBalance && (
            <p className="text-gray-400 text-sm mb-6">💡 {preview.elementBalance}</p>
          )}

          <div className="bg-gradient-to-r from-amber-900/20 to-amber-800/10 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-300">
              🔒 以上为免费预览。解锁完整报告获取：八字格局分析 · 紫微十二宫 · 奇门方位 · 占星相位 · 综合运势
            </p>
          </div>

          <button onClick={handlePurchase} disabled={loading} className="btn-glow w-full">
            {loading ? "跳转支付..." : `🔓 解锁完整报告 · $9.99`}
          </button>
        </div>
      )}

      {/* 信任区 */}
      <section className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
        <div className="card">
          <p className="text-2xl mb-1">🔐</p>
          <p>安全支付</p>
          <p className="text-xs">Stripe 加密</p>
        </div>
        <div className="card">
          <p className="text-2xl mb-1">⚡</p>
          <p>即时生成</p>
          <p className="text-xs">AI 实时分析</p>
        </div>
        <div className="card">
          <p className="text-2xl mb-1">📧</p>
          <p>PDF 报告</p>
          <p className="text-xs">邮件自动发送</p>
        </div>
      </section>
    </main>
  );
}
