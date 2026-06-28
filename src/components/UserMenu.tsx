"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function UserMenu({ lang }: { lang: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <span className="text-gray-600 text-sm w-6 text-center">·</span>;
  }

  if (!session?.user) {
    return (
      <a
        href={`/${lang}/auth/login`}
        className="text-amber-400 hover:text-amber-300 transition-colors text-sm"
      >
        {lang === "zh" ? "登录" : "Sign In"}
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-gray-300 hover:text-amber-400 transition-colors"
      >
        <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">
          {(session.user.name || session.user.email || "?")[0].toUpperCase()}
        </span>
        <span className="hidden sm:inline max-w-[80px] truncate">
          {session.user.name || session.user.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-48 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 py-2">
          <button
            onClick={() => { router.push(`/${lang}/dashboard`); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
          >
            📊 {lang === "zh" ? "我的控制台" : "Dashboard"}
          </button>
          <button
            onClick={() => { router.push(`/${lang}/partner`); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors"
          >
            🚀 {lang === "zh" ? "成为合伙人" : "Become Partner"}
          </button>
          <hr className="border-white/10 my-1" />
          <button
            onClick={() => signOut({ callbackUrl: `/${lang}` })}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
          >
            🚪 {lang === "zh" ? "退出登录" : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
}
