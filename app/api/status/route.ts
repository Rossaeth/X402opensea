import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const evmPayTo = process.env.X402_EVM_PAY_TO;
  const svmPayTo = process.env.X402_SOLANA_PAY_TO;
  const paymentsConfigured = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo) && svmPayTo && svmPayTo.trim().length > 20);
  const paymentsEnabled = process.env.X402_PAYMENTS_ENABLED === "true";
  const livePaymentsReady = paymentsEnabled && paymentsConfigured;
  const paymentsEnabled = process.env.X402_PAYMENTS_ENABLED === "true";
  const readyToCharge = paymentsEnabled && paymentsConfigured;

  return NextResponse.json({
    app: "x402 OpenSea",
    protocol: "x402 v2",
    facilitator: "PayAI",
    facilitatorConfigured: true,
    paymentMode: paymentsEnabled ? "paid" : "free",
    price: paymentsEnabled ? "Endpoint-specific x402 pricing" : "Free during development",
    networks: [
      { id: "eip155:8453", name: "Base", asset: "USDC", enabled: readyToCharge },
      { id: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", name: "Solana Mainnet", asset: "USDC", enabled: livePaymentsReady },
      { id: "eip155:5042002", name: "Arc Testnet", asset: "USDC", enabled: false, note: "UI preview only; not configured in payment middleware" }
    ],
    evmEnabled: readyToCharge,
    svmEnabled: readyToCharge,
    paymentVerification: !paymentsEnabled ? "x402 is disabled; endpoints are in free development mode" : readyToCharge ? "PayAI facilitator configured; live verification and settlement must still be tested" : "x402 enabled in settings but recipient addresses are missing or invalid",
    note: "Free mode is the default. Set X402_PAYMENTS_ENABLED=true only when ready to charge. A payment is successful only after x402 verification and settlement. Arc is not enabled."
  }, {
    headers: { "Cache-Control": "public, max-age=60" }
  });
}
