"use client";

import { useState } from "react";
import { getDictionary, Lang } from "@/i18n/dictionaries";

export default function NamingPage({ params: { lang } }: { params: { lang: Lang } }) {
  const dict = getDictionary(lang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    surname: "",
    birth: "",
    time: "12:00",
    gender: lang === "zh" ? "男" : "Male",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      else setError(dict.naming.error.payment);
    } catch {
      setError(dict.naming.error.network);
    } finally {
      setLoading(false);
    }
  };

  const handlePremium = async () => {
    if (form.surname && form.birth) {
      fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, product: "naming_premium" }),
      }).then(r => r.json()).then(d => { if (d.url) window.location.href = d.url; });
    } else {
      setError(dict.naming.error.fill);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">{dict.naming.title}</h1>
      <p className="text-center text-gray-400 mb-10">{dict.naming.subtitle}</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-lg font-bold mb-4">📋 {dict.naming.title}</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">{dict.naming.form.surname}</label>
              <input
                value={form.surname}
                onChange={(e) => setForm({ ...form, surname: e.target.value })}
                placeholder={dict.naming.form.surnamePlaceholder}
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">{dict.naming.form.birth}</label>
              <input
                type="date"
                value={form.birth}
                onChange={(e) => setForm({ ...form, birth: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">{dict.naming.form.time}</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">{dict.naming.form.gender}</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option>{dict.naming.form.male}</option>
                  <option>{dict.naming.form.female}</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-glow w-full">
              {loading ? dict.naming.form.paying : dict.naming.form.submit}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-2">{dict.naming.intro.title}</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>🔬 <strong className="text-white">{dict.naming.intro.item1.split("—")[0]}</strong> — {dict.naming.intro.item1.split("—")[1]}</li>
              <li>📐 <strong className="text-white">{dict.naming.intro.item2.split("—")[0]}</strong> — {dict.naming.intro.item2.split("—")[1]}</li>
              <li>⚖️ <strong className="text-white">{dict.naming.intro.item3.split("—")[0]}</strong> — {dict.naming.intro.item3.split("—")[1]}</li>
              <li>🎵 <strong className="text-white">{dict.naming.intro.item4.split("—")[0]}</strong> — {dict.naming.intro.item4.split("—")[1]}</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="font-bold mb-2">{dict.naming.result.title}</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>✅ {dict.naming.result.item1}</li>
              <li>✅ {dict.naming.result.item2}</li>
              <li>✅ {dict.naming.result.item3}</li>
              <li>✅ {dict.naming.result.item4}</li>
              <li>✅ {dict.naming.result.item5}</li>
              <li>✅ {dict.naming.result.item6}</li>
            </ul>
          </div>

          {/* Premium */}
          <div className="card border-amber-400/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-400">{dict.naming.premium.title}</h3>
              <span className="text-amber-400 font-bold">{dict.naming.premium.price}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{dict.naming.premium.desc}</p>
            <button onClick={handlePremium} className="w-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-400 py-2 rounded-lg text-sm transition-colors">
              {dict.naming.premium.btn}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
