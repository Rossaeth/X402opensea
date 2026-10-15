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

const paymentServer = (() => {
  const facilitator = new HTTPFacilitatorClient({ url: facilitatorUrl });
  const server = new x402ResourceServer(facilitator);
  server.register("eip155:8453", new ExactEvmScheme());
  server.register("solana:mainnet", new ExactSvmScheme());
  return server;
})();

const paymentHandler = evmValid && svmValid
  ? paymentProxy(
      {
        "/api/paid": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: "solana:mainnet", payTo: svmPayTo! },
          ],
          description: "Unlock demo digital collectible access",
          mimeType: "application/json",
          maxTimeoutSeconds: 120,
        },
      },
      paymentServer,
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
