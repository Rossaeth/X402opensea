import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
import { OPENSEA_CHAINS } from "@/lib/opensea";

// Keep the short UI values while translating them to OpenSea API v2 values.
const TIMEFRAMES: Record<string, string> = {
  "1h": "one_hour",
  "6h": "one_hour",
  "1d": "one_day",
  "7d": "seven_days",
  "30d": "thirty_days",
};

export async function GET(request: NextRequest) {
  const chain = (request.nextUrl.searchParams.get("chain") || "ethereum").toLowerCase();
  const timeframeInput = (request.nextUrl.searchParams.get("timeframe") || "7d").toLowerCase();
  const timeframe = TIMEFRAMES[timeframeInput];
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const limit = rawLimit === null ? 10 : Number(rawLimit);

  if (!OPENSEA_CHAINS.has(chain)) {
    return NextResponse.json(
      { success: false, error: "Unsupported chain.", supportedChains: Array.from(OPENSEA_CHAINS) },
      { status: 400 },
    );
  }
  if (!timeframe) {
    return NextResponse.json(
      { success: false, error: "Unsupported timeframe.", supportedTimeframes: Object.keys(TIMEFRAMES) },
      { status: 400 },
    );
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    return NextResponse.json(
      { success: false, error: "limit must be an integer from 1 to 20." },
      { status: 400 },
    );
  }

  // OpenSea API v2 expects "chains" (plural), and named timeframe values.
  const url = new URL(request.url);
  url.searchParams.delete("chain");
  url.searchParams.set("chains", chain);
  url.searchParams.set("timeframe", timeframe);
  url.searchParams.set("limit", String(limit));

  return openSeaGet(
    new NextRequest(url, request),
    "/collections/trending",
    ["chains", "timeframe", "limit", "cursor"],
  );
}
