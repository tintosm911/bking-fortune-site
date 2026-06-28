import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ refCode: string }> }
) {
  const { refCode } = await params;

  // Find partner by refCode
  const partner = await prisma.partner.findUnique({ where: { refCode } });

  if (!partner) {
    // Invalid ref code → redirect to home
    return NextResponse.redirect(new URL("/zh", req.url));
  }

  // Record the visit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent") || null;
  const visitorId = req.cookies.get("bking_vid")?.value || null;

  await prisma.referral.create({
    data: {
      partnerId: partner.id,
      visitorId,
      ip,
      userAgent: ua,
    },
  });

  // Set 30-day referral cookie
  const res = NextResponse.redirect(new URL("/zh", req.url));
  res.cookies.set("bking_ref", refCode, {
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    sameSite: "lax",
  });

  // Set visitor fingerprint if not present
  if (!visitorId) {
    res.cookies.set("bking_vid", crypto.randomUUID?.() || `v_${Date.now()}`, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "lax",
    });
  }

  return res;
}
