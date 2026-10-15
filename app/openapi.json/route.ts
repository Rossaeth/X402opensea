import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "x402 OpenSea API",
      version: "1.0.0",
      description: "Demo digital collectible access protected by x402 v2 payments. A successful response is demo access, not proof of NFT ownership.",
      contact: {
        email: "rossadi.ardian@gmail.com"
      }
    },
    servers: [{ url: "https://402opensea.vercel.app" }],
    paths: {
      "/api/opensea/collections": {
        get: {
          operationId: "getOpenSeaCollections",
          summary: "Fetch OpenSea collections",
          description: "Returns OpenSea collection metadata. Requires an x402 payment of 0.01 USD per request using Base USDC or Solana USDC when payment middleware is configured.",
          security: [{ x402Payment: [] }],
          "x-payment-info": {
            protocols: ["x402"],
            price: { mode: "fixed", currency: "USD", amount: "0.01" }
          },
          parameters: [
            { name: "chain", in: "query", required: false, schema: { type: "string", enum: ["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"], default: "base" } },
            { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 20, default: 6 } }
          ],
          responses: {
            "200": { description: "Collections returned after payment verification", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, source: { type: "string" }, chain: { type: "string" }, count: { type: "integer" }, collections: { type: "array", items: { type: "object", additionalProperties: true } } }, required: ["success", "source", "chain", "count", "collections"] } } } },
            "402": { description: "Payment required; submit a compatible x402 payment payload." },
            "503": { description: "x402 payment middleware is not configured." }
          }
        }
      },
      "/api/opensea/collection-details": {"get":{"operationId":"getOpenSeaCollectionDetails","summary":"Fetch collection metadata","description":"Paid OpenSea API proxy. Price is 0.01 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string","minLength":1,"maxLength":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/collection-stats": {"get":{"operationId":"getOpenSeaCollectionStats","summary":"Fetch collection statistics","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string","minLength":1,"maxLength":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/activity": {"get":{"operationId":"getOpenSeaCollectionActivity","summary":"Fetch collection events and sales activity","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string","minLength":1,"maxLength":100}},{"name":"limit","in":"query","required":false,"schema":{"type":"integer","minimum":1,"maximum":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/listings": {"get":{"operationId":"getOpenSeaListings","summary":"Fetch collection listings","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string","minLength":1,"maxLength":100}},{"name":"limit","in":"query","required":false,"schema":{"type":"integer","minimum":1,"maximum":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/offers": {"get":{"operationId":"getOpenSeaOffers","summary":"Fetch collection offers","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string","minLength":1,"maxLength":100}},{"name":"limit","in":"query","required":false,"schema":{"type":"integer","minimum":1,"maximum":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/wallet-nfts": {"get":{"operationId":"getOpenSeaWalletNFTs","summary":"Fetch NFTs owned by a wallet","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"address","in":"query","required":true,"schema":{"type":"string"}},{"name":"chain","in":"query","required":false,"schema":{"type":"string","default":"ethereum"}},{"name":"limit","in":"query","required":false,"schema":{"type":"integer","minimum":1,"maximum":100}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/nft-details": {"get":{"operationId":"getOpenSeaNFTDetails","summary":"Fetch NFT metadata by contract and token ID","description":"Paid OpenSea API proxy. Price is 0.01 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"contract","in":"query","required":true,"schema":{"type":"string","pattern":"^0x[a-fA-F0-9]{40}$"}},{"name":"token_id","in":"query","required":true,"schema":{"type":"string"}},{"name":"chain","in":"query","required":false,"schema":{"type":"string","default":"ethereum"}}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/paid": {
        get: {
          operationId: "unlockDemoCollectibleAccess",
          summary: "Unlock demo collectible access",
          description: "Requests access to demo collectible content for 0.01 USDC via x402. Call without payment first; the server should respond with HTTP 402 and a PAYMENT-REQUIRED challenge. Supported networks are Base mainnet and Solana mainnet-beta.",
          security: [{ x402Payment: [] }],
          "x-payment-info": {
            protocols: ["x402"],
            price: { mode: "fixed", currency: "USD", amount: "0.01" }
          },
          parameters: [],
          responses: {
            "200": {
              description: "Access granted after x402 payment verification and settlement",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      resource: { type: "string" },
                      message: { type: "string" },
                      price: { type: "string" },
                      note: { type: "string" }
                    },
                    required: ["success", "resource", "message", "price", "note"],
                    additionalProperties: false
                  },
                  example: {
                    success: true,
                    resource: "demo-collectible-access",
                    message: "The x402 payment middleware allowed this request.",
                    price: "0.01 USDC",
                    note: "This is demo access content, not proof of NFT ownership."
                  }
                }
              }
            },
            "402": {
              description: "Payment Required. The x402 v2 challenge is returned in the PAYMENT-REQUIRED response header.",
              headers: {
                "PAYMENT-REQUIRED": {
                  description: "Base64-encoded x402 v2 PaymentRequired challenge JSON",
                  schema: { type: "string" }
                }
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      x402Version: { type: "integer", const: 2 },
                      error: { type: "string" },
                      accepts: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            scheme: { type: "string", const: "exact" },
                            network: { type: "string" },
                            maxAmountRequired: { type: "string" },
                            resource: { type: "string" },
                            description: { type: "string" },
                            mimeType: { type: "string" },
                            payTo: { type: "string" },
                            maxTimeoutSeconds: { type: "integer" },
                            asset: { type: "string" },
                            extra: { type: "object", additionalProperties: true }
                          },
                          required: ["scheme", "network", "maxAmountRequired", "resource", "payTo"],
                          additionalProperties: true
                        }
                      },
                      errorMessage: { type: "string" },
                      extensions: { type: "object", additionalProperties: true }
                    },
                    required: ["x402Version", "accepts"],
                    additionalProperties: true
                  }
                }
              }
            },
            "503": {
              description: "Payment endpoint is not configured",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      configured: { type: "boolean", const: false }
                    },
                    required: ["error", "configured"]
                  }
                }
              }
            }
          }
        }
      },
      "/api/status": {
        get: {
          operationId: "getPaymentConfigurationStatus",
          summary: "Get public payment configuration status",
          description: "Reports configured networks. This does not prove facilitator availability or settlement.",
          security: [],
          responses: {
            "200": {
              description: "Public configuration status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      app: { type: "string" },
                      protocol: { type: "string" },
                      price: { type: "string" },
                      networks: { type: "array", items: { type: "object", additionalProperties: true } },
                      paymentVerification: { type: "string" },
                      note: { type: "string" },
                      evmEnabled: { type: "boolean" },
                      svmEnabled: { type: "boolean" }
                    },
                    additionalProperties: true
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        x402Payment: {
          type: "apiKey",
          in: "header",
          name: "PAYMENT-SIGNATURE",
          description: "x402 v2 payment payload header. Obtain the PAYMENT-REQUIRED challenge from the endpoint, construct a payment payload with a compatible x402 client, then retry with PAYMENT-SIGNATURE."
        }
      }
    }
  }, {
    headers: { "Cache-Control": "public, max-age=300" }
  });
}
