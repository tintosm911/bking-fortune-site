"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { getDictionary, Lang } from "@/i18n/dictionaries";

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

export default function ReadingPage({ params: { lang } }: { params: { lang: Lang } }) {
  const dict = getDictionary(lang);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ChartPreview | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    birth: "",
    time: "12:00",
    gender: lang === "zh" ? "男" : "Male",
    city: lang === "zh" ? "北京" : "New York",
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
      setError(dict.reading.error.network);
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
        setError(dict.reading.error.payment);
      }
    } catch {
      setError(dict.reading.error.service);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">{dict.reading.title}</h1>
      <p className="text-center text-gray-400 mb-10">{dict.reading.subtitle}</p>

      {/* Input Form */}
      <form onSubmit={handlePreview} className="card max-w-lg mx-auto mb-8">
        <div className="grid gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{dict.reading.form.name}</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={dict.reading.form.namePlaceholder}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{dict.reading.form.birth}</label>
            <input
              type="date"
              value={form.birth}
              onChange={(e) => setForm({ ...form, birth: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">{dict.reading.form.time}</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">{dict.reading.form.gender}</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>{dict.reading.form.male}</option>
                <option>{dict.reading.form.female}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{dict.reading.form.city}</label>
            <input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder={dict.reading.form.cityPlaceholder}
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-glow w-full">
            {loading ? dict.reading.form.analyzing : dict.reading.form.preview}
          </button>
        </div>
      </form>

      {/* Preview Result */}
      {preview && (
        <div className="card max-w-lg mx-auto mb-8 border-amber-400/20">
          <h2 className="text-xl font-bold mb-4 text-amber-400">
            📊 {form.name || dict.reading.preview.title}
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">{dict.reading.preview.bazi}</span>
              <p className="font-mono text-lg">{preview.bazi}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">{dict.reading.preview.dayMaster}</span>
              <p className="font-mono text-lg">{preview.dayMaster}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">{dict.reading.preview.sunSign}</span>
              <p className="text-lg">{preview.sunSign}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500">{dict.reading.preview.moonSign}</span>
              <p className="text-lg">{preview.moonSign}</p>
            </div>
          </div>

          {/* 5 Elements Chart */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">{dict.reading.preview.wuxing}</span>
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
            <p className="text-sm text-amber-300">{dict.reading.preview.locked}</p>
          </div>

          <button onClick={handlePurchase} disabled={loading} className="btn-glow w-full">
            {loading ? dict.reading.preview.paying : dict.reading.preview.unlock}
          </button>
        </div>
      )}

      {/* Trust Badges */}
      <section className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center text-sm text-gray-500">
        <div className="card">
          <p className="text-2xl mb-1">🔐</p>
          <p>{dict.reading.trust.secure}</p>
          <p className="text-xs">{dict.reading.trust.secureDesc}</p>
        </div>
        <div className="card">
          <p className="text-2xl mb-1">⚡</p>
          <p>{dict.reading.trust.instant}</p>
          <p className="text-xs">{dict.reading.trust.instantDesc}</p>
        </div>
        <div className="card">
          <p className="text-2xl mb-1">📧</p>
          <p>{dict.reading.trust.pdf}</p>
          <p className="text-xs">{dict.reading.trust.pdfDesc}</p>
        </div>
      </section>
    </main>
  );
}
