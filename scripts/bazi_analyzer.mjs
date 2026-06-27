// 八字分析独立脚本 — 被 Next.js API 调用
// 输入: JSON { year, month, day }
// 输出: JSON { bazi, dayMaster, wuxing, elementBalance }

const L = require("../xuanxue/lunar/lunar.js");

try {
  let input = "";
  process.stdin.on("data", d => input += d);
  process.stdin.on("end", () => {
    const data = JSON.parse(input.trim());
    const { year, month, day } = data;

    const solar = L.Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();
    const ba = lunar.getEightChar();

    const wxMap = {
      '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土',
      '庚':'金','辛':'金','壬':'水','癸':'水',
      '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火',
      '午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水'
    };

    const counts = { '金':0,'木':0,'水':0,'火':0,'土':0 };
    const pillars = [ba.getYear(), ba.getMonth(), ba.getDay(), ba.getTime()];
    pillars.forEach(p => {
      const s = String(p);
      counts[wxMap[s[0]]] = (counts[wxMap[s[0]]] || 0) + 1;
      counts[wxMap[s[1]]] = (counts[wxMap[s[1]]] || 0) + 1;
    });

    const weak = Object.entries(counts).filter(([,c]) => c < 1).map(([w]) => w);

    console.log(JSON.stringify({
      bazi: ba.toString(),
      dayMaster: ba.getDayGan() + "日主",
      wuxing: counts,
      elementBalance: weak.length > 0 ? "五行缺: " + weak.join("、") : "五行均衡",
    }));
  });
} catch(e) {
  console.log(JSON.stringify({ error: e.message }));
}
