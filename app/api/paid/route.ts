import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    success: true,
    resource: "demo-collectible-access",
    message: "The x402 payment middleware allowed this request.",
    price: "0.01 USDC",
    note: "This is demo access content, not proof of NFT ownership.",
  });
}
