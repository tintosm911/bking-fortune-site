// 语言检测工具 — 从请求头/URL/cookie 解析语言
import { Lang, defaultLang, langs } from "./dictionaries";

// 从 Accept-Language 头解析浏览器首选语言
export function parseAcceptLanguage(header: string | null): string | null {
  if (!header) return null;
  const first = header.split(",")[0]?.trim();
  if (!first) return null;
  // zh-CN, zh, zh-TW → zh
  if (first.startsWith("zh")) return "zh";
  if (first.startsWith("en")) return "en";
  return null;
}

// 从 URL pathname 提取 lang
export function getLangFromPath(pathname: string): Lang | null {
  const seg = pathname.split("/")[1];
  if (langs.includes(seg as Lang)) return seg as Lang;
  return null;
}

// 解析最佳语言
export function resolveLang(pathname: string, acceptLang: string | null): Lang {
  const fromPath = getLangFromPath(pathname);
  if (fromPath) return fromPath;
  const fromHeader = parseAcceptLanguage(acceptLang);
  if (fromHeader && (fromHeader === "zh" || fromHeader === "en")) return fromHeader;
  return defaultLang;
}
