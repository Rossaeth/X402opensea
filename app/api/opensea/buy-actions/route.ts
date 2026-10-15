import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) return NextResponse.json({ success: false, error: "OpenSea API key is not configured." }, { status: 503 });
  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ success: false, error: "Expected JSON body." }, { status: 400 }); }
  if (!body?.listing?.hash || !body?.listing?.chain || !body?.listing?.protocol_address || !body?.fulfiller?.address) {
    return NextResponse.json({ success: false, error: "Required fields: listing.hash, listing.chain, listing.protocol_address, fulfiller.address." }, { status: 400 });
  }
  const chain = String(body.listing.chain).toLowerCase();
  if (!["ethereum", "base", "polygon", "arbitrum", "optimism"].includes(chain)) {
    return NextResponse.json({ success: false, error: "Unsupported EVM chain for this fulfillment route." }, { status: 400 });
  }
  const payload = { listing: body.listing, fulfiller: body.fulfiller, ...(body.recipient ? { recipient: body.recipient } : {}), ...(body.units_to_fill ? { units_to_fill: body.units_to_fill } : {}) };
  try {
    const upstream = await fetch("https://api.opensea.io/api/v2/listings/fulfillment_data", {
      method: "POST", headers: { "X-API-KEY": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload), cache: "no-store", signal: AbortSignal.timeout(15000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json({ success: false, error: "OpenSea rejected the fulfillment request.", upstreamStatus: upstream.status }, { status: upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 400 });
    return NextResponse.json({ success: true, source: "OpenSea API v2", note: "Review the returned transaction, then sign and submit it with your own wallet. This API does not execute the purchase.", data }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ success: false, error: "Could not reach OpenSea API." }, { status: 502 }); }
}
