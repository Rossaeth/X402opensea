import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED_CHAINS = new Set(["ethereum", "base", "polygon", "arbitrum", "optimism"]);
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const SIGNATURE_RE = /^0x[a-fA-F0-9]+$/;

export async function POST(request: NextRequest) {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) {
    return NextResponse.json(
      { success: false, error: "OpenSea API key is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Expected a JSON request body." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ success: false, error: "Request body must be a JSON object." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const chain = typeof input.chain === "string" ? input.chain.toLowerCase() : "";
  const protocol = typeof input.protocol === "string" ? input.protocol.toLowerCase() : "";
  const protocolAddress = typeof input.protocol_address === "string" ? input.protocol_address : "";
  const signature = typeof input.signature === "string" ? input.signature : "";
  const parameters = input.parameters;

  if (!SUPPORTED_CHAINS.has(chain)) {
    return NextResponse.json(
      { success: false, error: "Unsupported chain. Supported chains: ethereum, base, polygon, arbitrum, optimism." },
      { status: 400 },
    );
  }
  if (protocol !== "seaport") {
    return NextResponse.json({ success: false, error: "Only the seaport protocol is supported." }, { status: 400 });
  }
  if (!ADDRESS_RE.test(protocolAddress)) {
    return NextResponse.json({ success: false, error: "protocol_address must be a valid EVM address." }, { status: 400 });
  }
  if (!SIGNATURE_RE.test(signature)) {
    return NextResponse.json({ success: false, error: "signature must be a 0x-prefixed hex signature." }, { status: 400 });
  }
  if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) {
    return NextResponse.json({ success: false, error: "parameters must be the listing parameters object returned by OpenSea listing-actions." }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://api.opensea.io/api/v2/orders/${encodeURIComponent(chain)}/${encodeURIComponent(protocolAddress)}/listings`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": key,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ parameters, signature }),
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenSea rejected the signed listing submission.",
          upstreamStatus: upstream.status,
          details: data,
        },
        { status: upstream.status === 429 ? 429 : upstream.status >= 500 ? 502 : 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: "OpenSea API v2",
        note: "The signed listing was submitted to OpenSea. The server did not create or sign the order; the wallet owner supplied the signature.",
        data,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not reach OpenSea API." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
