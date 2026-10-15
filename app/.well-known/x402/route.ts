import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    version: 1,
    resources: ["https://402opensea.vercel.app/api/paid"],
    instructions: "x402 OpenSea demo collectible access endpoint. Price is 0.01 USDC. The live HTTP 402 x402 v2 challenge is authoritative for currently supported networks and payment requirements. Arc is not enabled."
  }, {
    headers: { "Cache-Control": "public, max-age=300" }
  });
}
