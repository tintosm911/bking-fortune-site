"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PartnerPage({ params: { lang } }: { params: { lang: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    socialLinks: "",
  });

  if (status === "loading") {
    return <main className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">...</main>;
  }

  if (!session?.user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">
          🚀 {lang === "zh" ? "成为命理合伙人" : "Become a Fortune Partner"}
        </h1>
        <p className="text-gray-400 mb-8">
          {lang === "zh"
            ? "请先登录再申请"
            : "Please sign in first"}
        </p>
        <a href={`/${lang}/auth/login`} className="btn-glow">
          {lang === "zh" ? "去登录" : "Sign In"}
        </a>
      </main>
    );
  }

  const isZh = lang === "zh";

  const handleApply = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socialLinks: form.socialLinks }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError(isZh ? "网络错误" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-bold mb-3 text-amber-400">
          {isZh ? "申请成功！" : "Application Successful!"}
        </h1>
        <p className="text-gray-400 mb-6">
          {isZh ? "你的专属推广链接" : "Your exclusive referral link"}
        </p>
        <div className="card mb-6">
          <p className="text-lg font-mono text-amber-400 break-all select-all mb-2">
            bking.one/ref/{result.refCode}
          </p>
          <p className="text-xs text-gray-500">
            {isZh ? "分享此链接，客户通过此链接购买即可获得佣金" : "Share this link to earn commissions on every sale"}
          </p>
        </div>

        <div className="card mb-6 text-left">
          <h3 className="font-bold mb-3">{isZh ? "🎯 佣金规则" : "🎯 Commission Rules"}</h3>
          <div className="space-y-2 text-sm text-gray-400">
            <p>🥉 Bronze (0-$999): <span className="text-amber-400">30%</span></p>
            <p>🥈 Silver ($1000-$4999): <span className="text-amber-400">40%</span></p>
            <p>🥇 Gold ($5000+): <span className="text-amber-400">50%</span></p>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            {isZh ? "30天归因窗口 · 月结提现 · PayPal/微信/支付宝" : "30-day attribution window · Monthly payout · PayPal/WeChat/Alipay"}
          </p>
        </div>

        <a href={`/${lang}/dashboard`} className="btn-glow inline-block text-sm">
          📊 {isZh ? "去控制台查看" : "Go to Dashboard"}
        </a>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">
        🚀 {isZh ? "成为命理合伙人" : "Become a Fortune Partner"}
      </h1>
      <p className="text-center text-gray-400 mb-10">
        {isZh
          ? "分享你的专属链接，每次成交赚取 30%-50% 佣金"
          : "Share your referral link, earn 30%-50% on every sale"}
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[
          { icon: "🔗", title: isZh ? "专属链接" : "Exclusive Link", desc: isZh ? "每人一个唯一推广码" : "Unique referral code per partner" },
          { icon: "📊", title: isZh ? "实时数据" : "Real-time Data", desc: isZh ? "推广次数、成交单数一目了然" : "Track clicks, conversions in real-time" },
          { icon: "💸", title: isZh ? "阶梯佣金" : "Tiered Commission", desc: isZh ? "30%起，最高50%" : "Starting at 30%, up to 50%" },
          { icon: "📦", title: isZh ? "素材库" : "Asset Library", desc: isZh ? "现成文案+图片素材" : "Ready-to-use copy & images" },
        ].map((item, i) => (
          <div key={i} className="card text-center">
            <p className="text-3xl mb-2">{item.icon}</p>
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card mb-6">
        <h2 className="font-bold mb-4">{isZh ? "📋 申请表单" : "📋 Application"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              {isZh ? "你的社交媒体链接（选填）" : "Your social media links (optional)"}
            </label>
            <input
              value={form.socialLinks}
              onChange={(e) => setForm({ ...form, socialLinks: e.target.value })}
              placeholder={isZh ? "如：小红书@xxx、抖音@xxx" : "e.g. TikTok @xxx, YouTube @xxx"}
            />
            <p className="text-xs text-gray-600 mt-1">
              {isZh ? "填写后审核更快" : "Faster review with social links"}
            </p>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleApply} disabled={loading} className="btn-glow w-full">
            {loading
              ? (isZh ? "处理中..." : "Processing...")
              : (isZh ? "🎉 立即申请" : "🎉 Apply Now")}
          </button>
        </div>
      </div>
    </main>
  );
}
