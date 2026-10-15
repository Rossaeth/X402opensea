import { NextResponse, type NextRequest } from "next/server";
import { paymentProxy } from "@x402/next";
import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";

const evmPayTo = process.env.X402_EVM_PAY_TO;
const svmPayTo = process.env.X402_SOLANA_PAY_TO;
const facilitatorUrl = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator";
const evmValid = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo));
const svmValid = Boolean(svmPayTo && svmPayTo.trim().length > 20);

// CAIP-2 identifier for Solana mainnet-beta.
const SOLANA_MAINNET = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

const paymentServer = (() => {
  const facilitator = new HTTPFacilitatorClient({ url: facilitatorUrl });
  const server = new x402ResourceServer(facilitator);
  server.register("eip155:8453", new ExactEvmScheme());
  server.register(SOLANA_MAINNET, new ExactSvmScheme());
  return server;
})();

const paymentHandler = evmValid && svmValid
  ? paymentProxy(
      {
        "/api/paid": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Unlock demo digital collectible access",
          mimeType: "application/json",
          extensions: {
            bazaar: {
              info: {
                input: { type: "http", method: "GET" },
                output: {
                  type: "json",
                  example: {
                    success: true,
                    resource: "demo-collectible-access",
                    message: "The x402 payment middleware allowed this request.",
                    price: "0.01 USDC",
                    note: "This is demo access content, not proof of NFT ownership."
                  }
                }
              },
              schema: {
                $schema: "https://json-schema.org/draft/2020-12/schema",
                type: "object",
                properties: {
                  input: {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "http" },
                      method: { type: "string", enum: ["GET", "HEAD", "DELETE"] },
                      queryParams: {
                        type: "object",
                        additionalProperties: { type: "string" }
                      },
                      headers: {
                        type: "object",
                        additionalProperties: { type: "string" }
                      }
                    },
                    required: ["type", "method"],
                    additionalProperties: false
                  },
                  output: {
                    type: "object",
                    properties: {
                      type: { type: "string" },
                      example: { type: "object" }
                    },
                    required: ["type"]
                  }
                },
                required: ["input"]
              }
            }
          },
        },
      },
      paymentServer,
      undefined,
      undefined,
      false,
    )
  : null;

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/paid" && !paymentHandler) {
    return NextResponse.json(
      {
        error: "x402 payments are disabled until X402_EVM_PAY_TO and X402_SOLANA_PAY_TO are configured. No payment was taken.",
        configured: false,
      },
      { status: 503 },
    );
  }

  if (paymentHandler) return paymentHandler(request);
  return NextResponse.next();
}

export const config = { matcher: ["/api/paid"] };
