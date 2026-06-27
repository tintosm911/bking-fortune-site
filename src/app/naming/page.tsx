"use client";

import { useState } from "react";

export default function NamingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    surname: "",
    birth: "",
    time: "12:00",
    gender: "男",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.surname,
          birth: form.birth,
          time: form.time,
          gender: form.gender,
          product: "naming",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError("创建支付链接失败");
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">🎋 起名改名</h1>
      <p className="text-center text-gray-400 mb-10">
        八字五行补益 + 五格数理 + 三才配置 · 15个高分推荐名字
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 表单 */}
        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-bold mb-4">📋 起名信息</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">姓氏</label>
              <input
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                placeholder="如：王、李、张"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">宝宝/本人出生日期</label>
              <input
                type="date"
                value={form.birth}
                onChange={(e) => setForm({ ...form, birth: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">出生时间</label>
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
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-glow w-full">
              {loading ? "跳转支付..." : "🎋 立即起名 · $19.99"}
            </button>
          </div>
        </form>

        {/* 介绍 */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-2">💡 起名原理</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>🔬 <strong className="text-white">八字五行分析</strong> — 找出命盘缺什么、需要补什么</li>
              <li>📐 <strong className="text-white">五格数理</strong> — 81灵动数，天格/人格/地格/外格/总格</li>
              <li>⚖️ <strong className="text-white">三才配置</strong> — 天·人·地三格五行相生</li>
              <li>🎵 <strong className="text-white">音韵搭配</strong> — 平仄协调，朗朗上口</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">📦 你将获得</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✅ 八字五行诊断报告</li>
              <li>✅ 15 个高分推荐名字</li>
              <li>✅ 每个名字的五格评分</li>
              <li>✅ 三才配置吉凶分析</li>
              <li>✅ 姓名总评 + 建议</li>
              <li>✅ PDF 报告（可打印）</li>
            </ul>
          </div>

          {/* 至尊版 */}
          <div className="card border-amber-400/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-400">👑 至尊版起名</h3>
              <span className="text-amber-400 font-bold">$39.99</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">
              30个高分推荐 + 公司名推荐 + 完整三才五格分析 + 可打印精美PDF
            </p>
            <button onClick={() => {
              if (form.surname && form.birth) {
                fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...form, product: "naming_premium" }),
                }).then(r => r.json()).then(d => { if (d.url) window.location.href = d.url; });
              } else {
                setError("请先填写姓氏和出生日期");
              }
            }} className="w-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 py-2 rounded-lg text-sm transition-colors">
              升级至尊版
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
