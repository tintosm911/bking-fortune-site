import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { name, birth, time, gender, city, product } = session.metadata || {};
    const email = session.customer_details?.email || "";

    console.log("💰 支付成功:", { name, email, product, amount: session.amount_total });

    // TODO: 自动生成报告 + 发送邮件
    // 调用我们的命理引擎 → 生成 PDF → Resend 发送
    
    try {
      // 简单邮件通知（需要配置 Resend）
      if (process.env.RESEND_API_KEY && email) {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@bking-fortune.com",
          to: email,
          subject: `🔮 您的命盘报告正在生成中 | ${name || "亲爱的用户"}`,
          html: `
            <div style="max-width:600px;margin:auto;font-family:sans-serif;color:#e5e5e5;background:#0a0a0f;padding:40px;border-radius:12px;">
              <h1 style="color:#f59e0b;">🔮 命师BKing</h1>
              <p>感谢购买，<strong style="color:#f59e0b;">${name || "亲爱的用户"}</strong>！</p>
              <p>您的${product === "naming" ? "起名" : "命盘解读"}报告正在由AI系统生成中，预计10分钟内发送到您的邮箱。</p>
              <hr style="border-color:#333;margin:24px 0;">
              <p style="font-size:14px;color:#666;">命师BKing · AI Fortune Lab · 东西方双系统命理</p>
            </div>
          `,
        });
      }
    } catch (e) {
      console.error("邮件发送失败:", e);
      // 不阻断 webhook
    }
  }

  return NextResponse.json({ received: true });
}
