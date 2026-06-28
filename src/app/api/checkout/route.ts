import { NextRequest, NextResponse } from "next/server";

const PRICES: Record<string, { amount: number; name: string; description: string }> = {
  reading: {
    amount: 999, // $9.99
    name: "命盘解读 · 完整报告",
    description: "八字 + 紫微 + 奇门 + 西方占星 四套系统交叉验证深度解读",
  },
  naming: {
    amount: 1999, // $19.99
    name: "起名改名 · 五行定制",
    description: "基于八字五行补益 + 五格数理 + 三才配置，15个推荐名字",
  },
  naming_premium: {
    amount: 3999, // $39.99
    name: "起名改名 · 至尊版",
    description: "30个推荐 + 公司名 + 三才五格全分析 + PDF报告",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, birth, time, gender, city, product = "reading" } = body;

    const priceConfig = PRICES[product];
    if (!priceConfig) {
      return NextResponse.json({ error: "未知产品" }, { status: 400 });
    }

    // 动态导入 Stripe（避免构建时加载）
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: priceConfig.name,
              description: `${priceConfig.description} | ${name || "用户"} · ${birth}`,
            },
            unit_amount: priceConfig.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        name: name || "",
        birth: birth || "",
        time: time || "12:00",
        gender: gender || "unknown",
        city: city || "Shanghai",
        product,
        refCode: req.cookies.get("bking_ref")?.value || "",
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/reading`,
      // 客户信息
      ...(body.email ? { customer_email: body.email } : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "支付服务暂时不可用，请稍后重试" }, { status: 500 });
  }
}
