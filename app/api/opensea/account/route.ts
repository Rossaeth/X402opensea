import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ success: false, error: "Provide a valid EVM wallet using ?address=0x..." }, { status: 400 });
  }
  return openSeaGet(request, `/account/${encodeURIComponent(address)}/nfts`, ["limit", "next"]);
}
