import { RateLimiterMemory } from "rate-limiter-flexible";
import { NextRequest, NextResponse } from "next/server";

const rateLimiter = new RateLimiterMemory({
  points: 5,        // 5 tentatives
  duration: 60,     // par minute
  blockDuration: 300, // bloqué 5 minutes si dépassé
});

export async function applyRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  try {
    await rateLimiter.consume(ip);
    return null;
  } catch {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans 5 minutes." },
      { status: 429 }
    );
  }
}