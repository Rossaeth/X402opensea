import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "x402 OpenSea API",
      version: "1.0.0",
      description: "Demo digital collectible access protected by x402 v2 payments. A successful response is demo access, not proof of NFT ownership."
    },
    servers: [{ url: "https://402opensea.vercel.app" }],
    paths: {
      "/api/paid": {
        get: {
          operationId: "unlockDemoCollectibleAccess",
          summary: "Unlock demo collectible access",
          description: "Requests access to demo collectible content for 0.01 USDC via x402. The live 402 challenge is authoritative for supported networks and payment requirements.",
          security: [{ x402Payment: [] }],
          "x-payment-info": {
            protocols: ["x402"],
            price: { mode: "fixed", currency: "USD", amount: "0.01" }
          },
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
                    required: ["success", "resource", "message"]
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
              description: "Payment Required. Inspect the Payment-Required header for the x402 v2 challenge."
            },
            "503": {
              description: "Payment endpoint is not configured"
            }
          }
        }
      },
      "/api/status": {
        get: {
          operationId: "getPaymentConfigurationStatus",
          summary: "Get public payment configuration status",
          security: [],
          responses: {
            "200": {
              description: "Public configuration status; does not prove facilitator availability or settlement",
              content: { "application/json": { schema: { type: "object" } } }
            }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        x402Payment: {
          type: "http",
          scheme: "x402",
          description: "x402 v2 payment challenge returned by the live endpoint. A compatible client must pay and submit the required payment headers."
        }
      }
    }
  }, {
    headers: { "Cache-Control": "public, max-age=300" }
  });
}
