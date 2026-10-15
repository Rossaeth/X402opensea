import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  const chain = request.nextUrl.searchParams.get("chain") || "ethereum";

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json(
      { success: false, error: "Provide a valid EVM wallet using ?address=0x..." },
      { status: 400 },
    );
  }

  if (!/^[a-zA-Z0-9-]{1,40}$/.test(chain)) {
    return NextResponse.json(
      { success: false, error: "Provide a valid chain slug, for example ethereum or polygon." },
      { status: 400 },
    );
  }

  return openSeaGet(
    request,
    `/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(address)}/nfts`,
    ["limit", "next"],
  );
}
