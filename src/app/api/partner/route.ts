import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";

// POST /api/partner — Apply to become a partner
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { socialLinks = "" } = body;

  // Check if already a partner
  const existing = await prisma.partner.findUnique({
    where: { userId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({
      refCode: existing.refCode,
      tier: existing.tier,
      balance: existing.balance,
    });
  }

  // Generate unique referral code
  const refCode = randomBytes(4).toString("hex");

  const partner = await prisma.partner.create({
    data: {
      userId: session.user.id,
      refCode,
      socialLinks: socialLinks || null,
    },
  });

  return NextResponse.json({
    refCode: partner.refCode,
    tier: partner.tier,
    balance: partner.balance,
  });
}

// GET /api/partner — Get partner info
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: {
      referrals: { orderBy: { createdAt: "desc" }, take: 50 },
      commissions: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!partner) {
    return NextResponse.json({ partner: null });
  }

  return NextResponse.json({
    refCode: partner.refCode,
    tier: partner.tier,
    totalSales: partner.totalSales,
    commission: partner.commission,
    balance: partner.balance,
    socialLinks: partner.socialLinks,
    referralCount: partner.referrals.length,
    conversionCount: partner.referrals.filter((r) => r.converted).length,
    recentCommissions: partner.commissions.map((c) => ({
      amount: c.amount,
      status: c.status,
      createdAt: c.createdAt,
    })),
  });
}
