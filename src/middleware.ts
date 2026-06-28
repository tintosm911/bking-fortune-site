import { NextRequest, NextResponse } from "next/server";
import { resolveLang, getLangFromPath } from "./i18n/middleware";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 跳过 API / _next / static
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 解析语言
  const existing = getLangFromPath(pathname);
  if (existing) {
    // URL 已经有 lang 前缀，设置 cookie 并继续
    const res = NextResponse.next();
    res.cookies.set("lang", existing, { path: "/", maxAge: 365 * 24 * 60 * 60 });
    return res;
  }

  // 无 lang 前缀 → 重定向
  const lang = resolveLang(pathname, req.headers.get("accept-language"));
  const newUrl = new URL(`/${lang}${pathname === "/" ? "" : pathname}`, req.url);
  newUrl.search = req.nextUrl.search;
  const res = NextResponse.redirect(newUrl);
  res.cookies.set("lang", lang, { path: "/", maxAge: 365 * 24 * 60 * 60 });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|public|favicon.ico).*)"],
};
