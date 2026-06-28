"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

export function AuthForm({
  lang,
  dict,
}: {
  lang: string;
  dict: ReturnType<typeof getDictionary>;
}) {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        name: form.name,
        isRegister: isRegister ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "USER_EXISTS") {
          setError(lang === "zh" ? "该邮箱已注册，请直接登录" : "Email already registered. Please log in.");
        } else {
          setError(lang === "zh" ? "邮箱或密码错误" : "Invalid email or password.");
        }
      } else if (result?.ok) {
        router.push(`/${lang}`);
        router.refresh();
      }
    } catch {
      setError(lang === "zh" ? "网络错误，请重试" : "Network error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="card">
        <h1 className="text-2xl font-bold text-center mb-2">
          {isRegister
            ? lang === "zh"
              ? "创建账号"
              : "Create Account"
            : lang === "zh"
              ? "登录"
              : "Sign In"}
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          {isRegister
            ? lang === "zh"
              ? "注册后永久保存你的命盘"
              : "Register to save your charts forever"
            : lang === "zh"
              ? "登录查看你的命盘和订单"
              : "Sign in to view your charts and orders"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                {lang === "zh" ? "姓名" : "Name"}
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={lang === "zh" ? "你的姓名" : "Your name"}
              />
            </div>
          )}
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              {lang === "zh" ? "密码" : "Password"}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-glow w-full">
            {loading
              ? lang === "zh"
                ? "处理中..."
                : "Processing..."
              : isRegister
                ? lang === "zh"
                  ? "注册"
                  : "Register"
                : lang === "zh"
                  ? "登录"
                  : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister
            ? (lang === "zh" ? "已有账号？" : "Already have an account? ")
            : (lang === "zh" ? "没有账号？" : "No account? ")}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-amber-400 hover:underline"
          >
            {isRegister
              ? lang === "zh"
                ? "去登录"
                : "Sign In"
              : lang === "zh"
                ? "去注册"
                : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
