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
