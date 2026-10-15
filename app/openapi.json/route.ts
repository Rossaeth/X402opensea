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
            { name: "chain", in: "query", required: true, description: "OpenSea chain to query.", schema: { type: "string", enum: ["ethereum", "base", "polygon", "arbitrum", "optimism", "solana"], default: "base" }, example: "ethereum" },
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
      "/api/opensea/listing-actions": {
        post: {
          operationId: "createOpenSeaListingActions",
          summary: "Prepare NFT listing",
          description: "Returns approval and wallet-signing steps. This endpoint does not list the NFT until the user executes the wallet actions and submits the signed order.",
          security: [{ x402Payment: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["address", "items"], properties: { address: { type: "string", description: "Seller wallet address" }, items: { type: "array", minItems: 1, maxItems: 20, items: { type: "object", additionalProperties: true } }, taker: { type: "string" }, use_creator_fee: { type: "boolean", default: true } }, additionalProperties: true } } } },
          responses: { "200": { description: "Wallet actions to execute and sign" }, "400": { description: "Invalid request body" }, "402": { description: "x402 payment required" }, "502": { description: "OpenSea request failed" } }
        }
      },
      "/api/opensea/listing-submit": {
        post: {
          operationId: "submitOpenSeaListing",
          summary: "Submit signed NFT listing",
          description: "Submits a listing signed by the user's wallet. The server never signs on behalf of the user.",
          security: [{ x402Payment: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["chain", "protocol", "protocol_address", "parameters", "signature"], properties: { chain: { type: "string", enum: ["ethereum", "base", "polygon", "arbitrum", "optimism"] }, protocol: { type: "string", enum: ["seaport"] }, protocol_address: { type: "string", pattern: "^0x[a-fA-F0-9]{40}$" }, parameters: { type: "object", additionalProperties: true }, signature: { type: "string", pattern: "^0x[a-fA-F0-9]+$" } }, additionalProperties: false } } } },
          responses: { "200": { description: "Listing submitted" }, "400": { description: "Invalid request body" }, "402": { description: "x402 payment required" }, "502": { description: "OpenSea request failed" } }
        }
      },
      "/api/opensea/buy-actions": {
        post: {
          operationId: "getOpenSeaBuyActions",
          summary: "Prepare purchase of an NFT listing",
          description: "Returns transaction data needed to fulfill an EVM listing. The buyer must review, sign, and submit the transaction with their own wallet; this API does not execute a purchase.",
          security: [{ x402Payment: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["listing", "fulfiller"], properties: { listing: { type: "object", required: ["hash", "chain", "protocol_address"], properties: { hash: { type: "string" }, chain: { type: "string", enum: ["ethereum", "base", "polygon", "arbitrum", "optimism"] }, protocol_address: { type: "string" } }, additionalProperties: true }, fulfiller: { type: "object", required: ["address"], properties: { address: { type: "string" } }, additionalProperties: true }, recipient: { type: "string" }, units_to_fill: { type: "integer", minimum: 1 } }, additionalProperties: true } } } },
          responses: { "200": { description: "Transaction data returned for buyer wallet" }, "400": { description: "Invalid request body" }, "402": { description: "x402 payment required" }, "502": { description: "OpenSea request failed" } }
        }
      },
      "/api/opensea/sell-actions": {
        post: {
          operationId: "getOpenSeaSellActions",
          summary: "Prepare sale by accepting an offer",
          description: "Returns transaction data to accept an OpenSea offer. The seller must review, sign, and submit it with their own wallet; this API does not transfer the NFT.",
          security: [{ x402Payment: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["offer", "fulfiller", "consideration"], properties: { offer: { type: "object", required: ["hash", "chain", "protocol_address"], properties: { hash: { type: "string" }, chain: { type: "string" }, protocol_address: { type: "string" } }, additionalProperties: true }, fulfiller: { type: "object", required: ["address"], properties: { address: { type: "string" } }, additionalProperties: true }, consideration: { type: "object", required: ["asset_contract_address", "token_id"], properties: { asset_contract_address: { type: "string" }, token_id: { type: "string" } }, additionalProperties: true } }, additionalProperties: true } } } },
          responses: { "200": { description: "Transaction data returned for seller wallet" }, "400": { description: "Invalid request body" }, "402": { description: "x402 payment required" }, "502": { description: "OpenSea request failed" } }
        }
      },
      "/api/opensea/trending": {"get":{"operationId":"getTrendingCollections","summary":"Get trending OpenSea collections","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"chain","in":"query","schema":{"type":"string"},"required":false},{"name":"timeframe","in":"query","schema":{"type":"string"},"required":false},{"name":"limit","in":"query","schema":{"type":"integer"},"required":false},{"name":"next","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/top-collections": {"get":{"operationId":"getTopCollections","summary":"Get top OpenSea collections","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"chain","in":"query","schema":{"type":"string"},"required":false},{"name":"sort_by","in":"query","schema":{"type":"string"},"required":false},{"name":"limit","in":"query","schema":{"type":"integer"},"required":false},{"name":"next","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/floor-prices": {"get":{"operationId":"getCollectionFloorPriceHistory","summary":"Get collection floor price history","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"slug","in":"query","required":true,"schema":{"type":"string"}},{"name":"timeframe","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/wallet-portfolio": {"get":{"operationId":"getWalletPortfolio","summary":"Get wallet portfolio analytics","description":"Paid OpenSea API proxy. Price is 0.03 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"address","in":"query","required":true,"schema":{"type":"string"}},{"name":"chains","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/wallet-listings": {"get":{"operationId":"getWalletListings","summary":"Get active listings created by a wallet","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"address","in":"query","required":true,"schema":{"type":"string"}},{"name":"limit","in":"query","schema":{"type":"integer"},"required":false},{"name":"after","in":"query","schema":{"type":"string"},"required":false},{"name":"sort_by","in":"query","schema":{"type":"string"},"required":false},{"name":"sort_direction","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
      "/api/opensea/wallet-offers": {"get":{"operationId":"getWalletOffers","summary":"Get active offers made by a wallet","description":"Paid OpenSea API proxy. Price is 0.02 USD per request on supported x402 networks.","security":[{"x402Payment":[]}],"parameters":[{"name":"address","in":"query","required":true,"schema":{"type":"string"}},{"name":"limit","in":"query","schema":{"type":"integer"},"required":false},{"name":"after","in":"query","schema":{"type":"string"},"required":false}],"responses":{"200":{"description":"OpenSea data returned after payment verification","content":{"application/json":{"schema":{"type":"object","properties":{"success":{"type":"boolean"},"source":{"type":"string"},"data":{"type":"object","additionalProperties":true}},"required":["success","source","data"]}}}},"400":{"description":"Missing or invalid query parameters"},"402":{"description":"Payment required; follow the x402 challenge"},"502":{"description":"OpenSea upstream request failed"},"503":{"description":"OpenSea API key or payment configuration missing"}}}},
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
          parameters: [
            { name: "access", in: "query", required: true, description: "Access scope for the demo collectible endpoint.", schema: { type: "string", enum: ["demo-collectible-access"] }, example: "demo-collectible-access" }
          ],
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
