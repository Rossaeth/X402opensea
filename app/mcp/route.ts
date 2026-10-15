import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Property = {
  type: string;
  description?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  default?: string | number;
};

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  path: string;
  required?: string[];
  properties: Record<string, Property>;
};

const slug: Property = { type: "string", description: "OpenSea collection slug." };
const chain: Property = {
  type: "string",
  description: "Blockchain supported by OpenSea for this query.",
  enum: ["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"],
};
const limit: Property = {
  type: "integer",
  description: "Maximum number of results.",
  minimum: 1,
  maximum: 100,
};
const address: Property = { type: "string", description: "Public wallet address." };
const WIDGET_URI = "ui://x402opensea/nft-market.html";
const WIDGET_HTML = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}body{margin:0;padding:14px;background:#0b0e0c;color:#f4f6f1;font:13px Inter,system-ui,sans-serif}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}.brand{font-weight:800;font-size:17px}.brand b{color:#b6ff77}.pill{font-size:9px;color:#b6ff77;border:1px solid #34462e;border-radius:20px;padding:6px 8px}h1{font-size:23px;letter-spacing:-.8px;margin:8px 0}p{font-size:12px;line-height:1.5;color:#9ca79b;margin:0 0 14px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px}.card{border:1px solid #ffffff19;border-radius:9px;background:#121713;overflow:hidden}.image{height:145px;background:linear-gradient(135deg,#243f27,#101711);display:grid;place-items:center;color:#b6ff77;font-size:42px}.image img{width:100%;height:100%;object-fit:cover}.body{padding:10px}.name{font-weight:750;font-size:12px;line-height:1.4;overflow-wrap:anywhere}.meta{font-size:10px;color:#8a9689;margin-top:5px}.link{display:inline-block;margin-top:10px;color:#b6ff77;font-size:11px;text-decoration:none}.status{border:1px solid #2c3a2b;background:#101610;border-radius:8px;padding:13px;color:#b6c5b2;font-size:12px}.foot{margin-top:12px;padding-top:10px;border-top:1px solid #ffffff15;color:#748071;font-size:9px;display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}@media(max-width:380px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.image{height:115px}}
</style></head><body><div class="head"><div class="brand">✳ X402<b>SEA</b></div><span class="pill">OPENSEA DATA</span></div><h1 id="title">NFT market results</h1><p id="desc">Actual collection and NFT metadata returned by X402 OpenSea.</p><div id="status" class="status">Waiting for the tool result…</div><div id="grid" class="grid"></div><div class="foot"><span>Read-only market research</span><span>x402 payments remain disabled</span></div><script>
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function arrOf(x){if(!x||typeof x!=="object")return[];for(const k of ["collections","nfts","assets","results","items"])if(Array.isArray(x[k]))return x[k];if(x.data&&typeof x.data==="object")return arrOf(x.data);return[]}
function render(out){if(!out)return;let data=out.structuredContent||out;let raw=data.data||data;let rows=arrOf(raw);document.getElementById("title").textContent=data.view==="nfts"||data.slug?"NFTs in collection": "Top NFT collections";document.getElementById("desc").textContent="Live metadata from the X402 OpenSea API. Images and names reflect API data.";let status=document.getElementById("status");status.style.display=rows.length?"none":"block";status.textContent=rows.length?"":"No NFT list found in the returned response. Ask the assistant to inspect collection details.";document.getElementById("grid").innerHTML=rows.map((x,i)=>{let name=x.name||x.collection||x.title||x.identifier||x.slug||("NFT "+(i+1));let img=x.image_url||x.image||x.display_image_url||x.thumbnail_url;let url=x.opensea_url||x.permalink||(x.slug?"https://opensea.io/collection/"+encodeURIComponent(x.slug):"https://opensea.io");let floor=x.floor_price??x.floorPrice;let network=x.chain||x.network||"";return '<article class="card"><div class="image">'+(img?'<img src="'+esc(img)+'" alt="'+esc(name)+'" loading="lazy" onerror="this.remove()">':'✳')+'</div><div class="body"><div class="name">'+esc(name)+'</div><div class="meta">'+esc(network)+(floor!=null?" · Floor "+esc(floor):"")+'</div><a class="link" target="_blank" rel="noreferrer" href="'+esc(url)+'">View on OpenSea ↗</a></div></article>'}).join("")}
if(window.openai&&window.openai.toolOutput)render(window.openai.toolOutput);window.addEventListener("message",e=>{if(e.data&&e.data.type==="openai:tool_output")render(e.data.output)});
</script></body></html>`;

const TOOLS: ToolDefinition[] = [
  {
    name: "opensea_collections",
    title: "OpenSea collections",
    description: "Fetch collection metadata. Paid endpoint: normally 0.01 USD per request via x402 on Base USDC or Solana USDC.",
    path: "/api/opensea/collections",
    required: ["chain"],
    properties: { chain, limit: { ...limit, maximum: 20, default: 6 } },
  },
  {
    name: "collection_details",
    title: "Collection details",
    description: "Fetch metadata for one collection. Paid endpoint: normally 0.01 USD per request via x402.",
    path: "/api/opensea/collection-details",
    required: ["slug"],
    properties: { slug },
  },
  {
    name: "collection_stats",
    title: "Collection statistics",
    description: "Fetch OpenSea statistics for a collection. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/collection-stats",
    required: ["slug"],
    properties: { slug },
  },
  {
    name: "collection_activity",
    title: "Collection activity",
    description: "Fetch recent sales and events for a collection. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/activity",
    required: ["slug"],
    properties: { slug, limit },
  },
  {
    name: "collection_listings",
    title: "Collection listings",
    description: "Fetch active listings for a collection. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/listings",
    required: ["slug"],
    properties: { slug, limit, next: { type: "string", description: "OpenSea pagination cursor, if available." } },
  },
  {
    name: "collection_offers",
    title: "Collection offers",
    description: "Fetch offers for a collection. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/offers",
    required: ["slug"],
    properties: { slug, limit, next: { type: "string", description: "OpenSea pagination cursor, if available." } },
  },
  {
    name: "wallet_nfts",
    title: "Wallet NFTs",
    description: "Fetch NFTs owned by a wallet. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/wallet-nfts",
    required: ["address"],
    properties: { address, chain, limit },
  },
  {
    name: "nft_details",
    title: "NFT details",
    description: "Fetch NFT metadata using its contract address and token ID. Paid endpoint: normally 0.01 USD per request via x402.",
    path: "/api/opensea/nft-details",
    required: ["contract", "token_id"],
    properties: {
      contract: { type: "string", description: "NFT contract address (0x-prefixed for EVM chains)." },
      token_id: { type: "string", description: "NFT token ID." },
      chain,
    },
  },
  {
    name: "trending_collections",
    title: "Trending collections",
    description: "Fetch trending OpenSea collections. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/trending",
    properties: {
      chain,
      timeframe: { type: "string", description: "OpenSea timeframe, if supported." },
      limit,
      next: { type: "string", description: "OpenSea pagination cursor, if available." },
    },
  },
  {
    name: "nfts_in_collection",
    title: "NFTs in a collection",
    description: "Fetch real NFT artwork and metadata from a named OpenSea collection. This is a read-only research tool; it does not purchase or list NFTs.",
    path: "/api/opensea/nfts",
    required: ["slug"],
    properties: { slug, limit: { ...limit, maximum: 10, default: 6 }, next: { type: "string", description: "OpenSea pagination cursor, if available." } },
  },
  {
    name: "top_collections",
    title: "Top collections",
    description: "Fetch top OpenSea collections. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/top-collections",
    properties: {
      chain,
      sort_by: { type: "string", description: "OpenSea ranking field, if supported." },
      limit,
      next: { type: "string", description: "OpenSea pagination cursor, if available." },
    },
  },
  {
    name: "floor_prices",
    title: "Collection floor prices",
    description: "Fetch floor-price history for a collection. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/floor-prices",
    required: ["slug"],
    properties: { slug, timeframe: { type: "string", description: "Requested history timeframe, if supported." } },
  },
  {
    name: "wallet_portfolio",
    title: "Wallet portfolio",
    description: "Fetch wallet portfolio analytics. Paid endpoint: normally 0.03 USD per request via x402.",
    path: "/api/opensea/wallet-portfolio",
    required: ["address"],
    properties: {
      address,
      chains: { type: "string", description: "Comma-separated chain identifiers, if supported." },
    },
  },
  {
    name: "wallet_listings",
    title: "Wallet listings",
    description: "Fetch active listings created by a wallet. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/wallet-listings",
    required: ["address"],
    properties: {
      address,
      limit,
      after: { type: "string", description: "Pagination cursor, if available." },
      sort_by: { type: "string", description: "Sort field, if supported." },
      sort_direction: { type: "string", description: "Sort direction, if supported." },
    },
  },
  {
    name: "wallet_offers",
    title: "Wallet offers",
    description: "Fetch active offers made by a wallet. Paid endpoint: normally 0.02 USD per request via x402.",
    path: "/api/opensea/wallet-offers",
    required: ["address"],
    properties: {
      address,
      limit,
      after: { type: "string", description: "Pagination cursor, if available." },
    },
  },
];

function jsonRpc(id: unknown, result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id, result });
}

function rpcError(id: unknown, code: number, message: string, data?: unknown) {
  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data === undefined ? {} : { data }) },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textResult(text: string, isError = false) {
  return { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) };
}

export async function GET() {
  return NextResponse.json({
    name: "x402-opensea-mcp",
    version: "1.0.0",
    protocol: "MCP Streamable HTTP",
    endpoint: "/mcp",
    tools: TOOLS.length,
    note: "Use POST with JSON-RPC. Paid tools may return HTTP 402 until a compatible x402 payment is supplied.",
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON-RPC request body." }, { status: 400 });
  }

  if (!isRecord(body) || body.jsonrpc !== "2.0" || typeof body.method !== "string") {
    return rpcError(isRecord(body) ? body.id : null, -32600, "Invalid JSON-RPC request.");
  }

  const id = body.id;
  const method = body.method;

  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return new Response(null, { status: 202 });
  }
  if (method === "ping") return jsonRpc(id, {});
  if (method === "resources/list") return jsonRpc(id, { resources: [{ uri: WIDGET_URI, name: "X402 OpenSea NFT Market", title: "X402 OpenSea NFT Market", description: "Visual NFT cards for in-chat display.", mimeType: "text/html+skybridge", _meta: { "openai/widgetPrefersBorder": true, "openai/widgetCSP": { resource_domains: ["https://opensea.io", "https://i.seadn.io", "https://static.opensea.io"] } } }] });
  if (method === "resources/read") {
    const params = isRecord(body.params) ? body.params : {};
    if (params.uri !== WIDGET_URI) return rpcError(id, -32602, "Unknown resource URI.");
    return jsonRpc(id, { contents: [{ uri: WIDGET_URI, mimeType: "text/html+skybridge", text: WIDGET_HTML, _meta: { "openai/widgetPrefersBorder": true, "openai/widgetCSP": { resource_domains: ["https://opensea.io", "https://i.seadn.io", "https://static.opensea.io"] } } }] });
  }
  if (method === "initialize") {
    return jsonRpc(id, {
      protocolVersion: typeof body.params === "object" && body.params && "protocolVersion" in body.params
        ? (body.params as { protocolVersion: string }).protocolVersion
        : "2025-03-26",
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "x402-opensea", version: "1.0.0" },
      instructions: "OpenSea data tools for NFT collection and wallet analytics. Paid API routes use x402; review the price and network before authorizing payment.",
    });
  }

  if (method === "tools/list") {
    return jsonRpc(id, {
      tools: TOOLS.map((tool) => ({
        name: tool.name,
        title: tool.title,
        description: tool.description,
        inputSchema: {
          type: "object",
          properties: tool.properties,
          required: tool.required ?? [],
          additionalProperties: false,
        },
        ...(["top_collections", "trending_collections", "nfts_in_collection", "opensea_collections"].includes(tool.name) ? { _meta: { "openai/outputTemplate": WIDGET_URI, "openai/widgetAccessible": true, "openai/toolInvocation/invoking": "Loading NFT market data…", "openai/toolInvocation/invoked": "NFT market data loaded" } } : {}),
      })),
    });
  }

  if (method !== "tools/call") return rpcError(id, -32601, `Method not found: ${method}`);

  const params = isRecord(body.params) ? body.params : {};
  const name = params.name;
  const args = isRecord(params.arguments) ? params.arguments : {};
  const tool = TOOLS.find((item) => item.name === name);
  if (!tool) return rpcError(id, -32602, "Unknown tool name.");

  for (const required of tool.required ?? []) {
    if (typeof args[required] !== "string" || !(args[required] as string).trim()) {
      return jsonRpc(id, textResult(`Missing required input: ${required}`, true));
    }
  }

  const url = new URL(tool.path, new URL(request.url).origin);
  for (const [key, value] of Object.entries(args)) {
    if (key === "paymentSignature") continue;
    if (!(key in tool.properties)) {
      return jsonRpc(id, textResult(`Unsupported input: ${key}`, true));
    }
    if (typeof value !== "string" && typeof value !== "number") {
      return jsonRpc(id, textResult(`Input ${key} must be a string or number.`, true));
    }
    url.searchParams.set(key, String(value));
  }

  const paymentSignature = args.paymentSignature;
  if (paymentSignature !== undefined && typeof paymentSignature !== "string") {
    return jsonRpc(id, textResult("paymentSignature must be a string.", true));
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(typeof paymentSignature === "string" && paymentSignature
          ? { "PAYMENT-SIGNATURE": paymentSignature }
          : {}),
      },
      cache: "no-store",
    });
    const responseText = await response.text();
    let payload: unknown = responseText;
    try {
      payload = JSON.parse(responseText);
    } catch {
      // Preserve non-JSON upstream responses as text.
    }

    if (response.status === 402) {
      const challenge = response.headers.get("payment-required");
      return jsonRpc(id, textResult(JSON.stringify({
        error: "Payment required",
        status: 402,
        tool: tool.name,
        price: tool.description,
        paymentRequired: challenge,
        instructions: "Use a compatible x402 client or PayBox payment service to authorize payment, then retry with the resulting PAYMENT-SIGNATURE payload if supported. No payment was made by this MCP request.",
      }, null, 2), true));
    }

    if (!response.ok) {
      return jsonRpc(id, textResult(JSON.stringify({
        error: "OpenSea API request failed",
        status: response.status,
        details: payload,
      }, null, 2), true));
    }

    if (["top_collections", "trending_collections", "nfts_in_collection", "opensea_collections"].includes(tool.name)) {
      return jsonRpc(id, {
        content: [{ type: "text", text: `Loaded real OpenSea data using ${tool.title}.` }],
        structuredContent: { view: tool.name === "nfts_in_collection" ? "nfts" : "collections", tool: tool.name, slug: typeof args.slug === "string" ? args.slug : undefined, chain: typeof args.chain === "string" ? args.chain : undefined, data: payload },
        _meta: { "openai/outputTemplate": WIDGET_URI }
      });
    }
    return jsonRpc(id, textResult(JSON.stringify(payload, null, 2)));
  } catch (error) {
    return jsonRpc(id, textResult(JSON.stringify({
      error: "Could not reach the OpenSea API route.",
      details: error instanceof Error ? error.message : "Unknown error",
    }, null, 2), true));
  }
}
