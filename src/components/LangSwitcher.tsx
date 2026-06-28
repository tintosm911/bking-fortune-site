"use client";
import { useRouter, usePathname } from "next/navigation";
import { dictionaries, Lang } from "@/i18n/dictionaries";

export function LangSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const target = currentLang === "zh" ? "en" : "zh";
  const label = dictionaries[target as Lang]?.site.langSwitch ?? target.toUpperCase();

  const switchLang = () => {
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = target;
    router.push("/" + segments.join("/"));
  };

  return (
    <button
      onClick={switchLang}
      className="text-xs border border-white/10 hover:border-amber-400/50 hover:text-amber-400 px-2 py-1 rounded transition-colors ml-2"
    >
      {label}
    </button>
  );
}
