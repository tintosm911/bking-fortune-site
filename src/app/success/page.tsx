import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🔮</div>
      <h1 className="text-3xl font-bold mb-4">支付成功！</h1>
      <p className="text-gray-400 mb-3">
        您的命盘报告正在由 AI 系统生成
      </p>
      <p className="text-gray-500 text-sm mb-8">
        八字 + 紫微 + 奇门 + 西方占星 — 四套系统交叉验证<br />
        完整报告将在 10 分钟内发送到您的邮箱
      </p>
      <div className="card mb-8">
        <p className="text-amber-400 text-sm">
          💡 如未收到邮件，请检查垃圾邮件箱或联系客服
        </p>
      </div>
      <Link href="/" className="text-amber-400 hover:underline">
        ← 返回首页
      </Link>
    </main>
  );
}
