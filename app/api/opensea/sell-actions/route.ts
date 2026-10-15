import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) return NextResponse.json({ success: false, error: "OpenSea API key is not configured." }, { status: 503 });
  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ success: false, error: "Expected JSON body." }, { status: 400 }); }
  if (!body?.offer?.hash || !body?.offer?.chain || !body?.offer?.protocol_address || !body?.fulfiller?.address || !body?.consideration?.asset_contract_address || !body?.consideration?.token_id) {
    return NextResponse.json({ success: false, error: "Required fields: offer.hash, offer.chain, offer.protocol_address, fulfiller.address, consideration.asset_contract_address, consideration.token_id." }, { status: 400 });
  }
  try {
    const upstream = await fetch("https://api.opensea.io/api/v2/offers/fulfillment_data", {
      method: "POST", headers: { "X-API-KEY": key, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ offer: body.offer, fulfiller: body.fulfiller, consideration: body.consideration }), cache: "no-store", signal: AbortSignal.timeout(15000)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json({ success: false, error: "OpenSea rejected the offer fulfillment request.", upstreamStatus: upstream.status }, { status: upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 400 });
    return NextResponse.json({ success: true, source: "OpenSea API v2", note: "Review the returned transaction, then sign and submit it with your own wallet. This API does not transfer the NFT by itself.", data }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ success: false, error: "Could not reach OpenSea API." }, { status: 502 }); }
}
