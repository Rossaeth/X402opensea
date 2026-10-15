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

    return jsonRpc(id, textResult(JSON.stringify(payload, null, 2)));
  } catch (error) {
    return jsonRpc(id, textResult(JSON.stringify({
      error: "Could not reach the OpenSea API route.",
      details: error instanceof Error ? error.message : "Unknown error",
    }, null, 2), true));
  }
}
