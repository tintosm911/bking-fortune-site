import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

// 城市坐标映射
const CITY_COORDS: Record<string, { lon: number; lat: number }> = {
  "北京": { lon: 116.41, lat: 39.90 },
  "上海": { lon: 121.47, lat: 31.23 },
  "天津": { lon: 117.20, lat: 39.13 },
  "重庆": { lon: 106.55, lat: 29.57 },
  "广州": { lon: 113.26, lat: 23.13 },
  "深圳": { lon: 114.07, lat: 22.62 },
  "成都": { lon: 104.07, lat: 30.67 },
  "杭州": { lon: 120.15, lat: 30.28 },
  "武汉": { lon: 114.30, lat: 30.60 },
  "南京": { lon: 118.78, lat: 32.06 },
};

const ENGINE_DIR = process.env.ENGINE_DIR || "D:/workspace-moodiys/xuanxue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birth, time = "12:00", city = "上海", preview = true } = body;

    if (!birth) {
      return NextResponse.json({ error: "请填写出生日期" }, { status: 400 });
    }

    const [y, m, d] = birth.split("-").map(Number);
    if (!y || !m || !d) {
      return NextResponse.json({ error: "日期格式无效，请使用 YYYY-MM-DD" }, { status: 400 });
    }

    const coords = CITY_COORDS[city] || { lon: 121.47, lat: 31.23 };
    const timeHour = parseInt(time.split(":")[0]) || 12;

    // 1. 简化八字计算（直接内联，避免跨进程调用）
    const baziResult = computeBazi(y, m, d, timeHour);

    // 2. 尝试调用西方占星 Python
    let westernResult: any = { sunSign: "待计算", moonSign: "待计算", ascSign: "待计算" };
    try {
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const ws = await runPython([
        join(ENGINE_DIR, "western_astrology.py"),
        "--birth", dateStr, time,
        "--name", (name || "User").replace(/\s/g, "_"),
        "--lat", String(coords.lat),
        "--lon", String(coords.lon),
      ]);
      const sunMatch = ws.match(/太阳落在.*?(\S+座)/)?.[1];
      const moonMatch = ws.match(/月亮落在.*?(\S+座)/)?.[1];
      const ascMatch = ws.match(/上升.*?(\S+座)/)?.[1];
      westernResult = {
        sunSign: sunMatch || "待计算",
        moonSign: moonMatch || "待计算",
        ascSign: ascMatch || "待计算",
      };
    } catch {
      // Python 不可用时用默认值
    }

    return NextResponse.json({
      name: name || "您",
      bazi: baziResult.bazi,
      dayMaster: baziResult.dayMaster,
      sunSign: westernResult.sunSign,
      moonSign: westernResult.moonSign,
      ascSign: westernResult.ascSign,
      wuxing: baziResult.wuxing,
      elementBalance: baziResult.elementBalance,
    });
  } catch (error: any) {
    console.error("Chart API error:", error);
    return NextResponse.json({ error: "分析失败，请稍后重试" }, { status: 500 });
  }
}

function computeBazi(y: number, m: number, d: number, h: number) {
  // 干支表
  const tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const wuxingMap: Record<string, string> = {
    "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土", "己": "土",
    "庚": "金", "辛": "金", "壬": "水", "癸": "水",
    "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土", "巳": "火",
    "午": "火", "未": "土", "申": "金", "酉": "金", "戌": "土", "亥": "水",
  };

  // 年柱（简化：以立春为界，此处用公历2月4日近似）
  const yearStart = m < 2 || (m === 2 && d < 4) ? y - 1 : y;
  const yearGanIdx = (yearStart - 4) % 10;
  const yearZhiIdx = (yearStart - 4) % 12;
  const yearPillar = tianGan[yearGanIdx] + diZhi[yearZhiIdx];

  // 月柱（节气简化：每月约1月6日小寒，2月4日立春...用近似法）
  const monthGanBase = (yearGanIdx % 5) * 2;
  const monthZhiIdx = ((m - 1 + 2) % 12 + 12) % 12; // 寅月为正月
  const monthGanIdx = (monthGanBase + monthZhiIdx) % 10;
  const monthPillar = tianGan[monthGanIdx] + diZhi[monthZhiIdx];

  // 日柱（公历→儒略日→干支，简化公式）
  const jd = julianDay(y, m, d);
  const dayGanIdx = (Math.floor(jd + 0.5) - 1) % 10;
  const dayZhiIdx = (Math.floor(jd + 0.5) - 1) % 12;
  const dayGan = tianGan[dayGanIdx];
  const dayZhi = diZhi[dayZhiIdx];
  const dayPillar = dayGan + dayZhi;

  // 时柱
  const hourZhiIdx = Math.floor((h + 1) / 2) % 12;
  const hourGanIdx = (dayGanIdx % 5 * 2 + hourZhiIdx) % 10;
  const hourPillar = tianGan[hourGanIdx] + diZhi[hourZhiIdx];

  // 五行统计
  const counts: Record<string, number> = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    counts[wuxingMap[p[0]]] = (counts[wuxingMap[p[0]]] || 0) + 1;
    counts[wuxingMap[p[1]]] = (counts[wuxingMap[p[1]]] || 0) + 1;
  });

  const weak = Object.entries(counts).filter(([, c]) => c < 1).map(([w]) => w);

  return {
    bazi: `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}`,
    dayMaster: `${dayGan}${dayZhi} · ${dayGan}${wuxingMap[dayGan]}日主`,
    wuxing: counts,
    elementBalance: weak.length > 0 ? `五行缺「${weak.join("、")}」，起名宜补` : "五行均衡，运势平稳",
  };
}

function julianDay(y: number, m: number, d: number): number {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

async function runPython(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = join(ENGINE_DIR, ".venv/Scripts/python.exe");
    const proc = spawn(python, args, {
      cwd: ENGINE_DIR,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 60000,
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d: Buffer) => stdout += d.toString());
    proc.stderr.on("data", (d: Buffer) => stderr += d.toString());
    proc.on("close", (code: number) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(stderr || `Python exited ${code}`));
    });
    proc.on("error", reject);
  });
}
