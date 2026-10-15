import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const evmPayTo = process.env.X402_EVM_PAY_TO;
  const svmPayTo = process.env.X402_SOLANA_PAY_TO;
  const paymentsConfigured = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo) && svmPayTo && svmPayTo.trim().length > 20);

  return NextResponse.json({
    app: "x402 OpenSea",
    protocol: "x402 v2",
    facilitator: "PayAI",
    facilitatorConfigured: true,
    price: "0.01 USDC",
    networks: [
      { id: "eip155:8453", name: "Base", asset: "USDC", enabled: paymentsConfigured },
      { id: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp", name: "Solana Mainnet", asset: "USDC", enabled: paymentsConfigured },
      { id: "eip155:5042002", name: "Arc Testnet", asset: "USDC", enabled: false, note: "UI preview only; not configured in payment middleware" }
    ],
    evmEnabled: paymentsConfigured,
    svmEnabled: paymentsConfigured,
    paymentVerification: paymentsConfigured ? "PayAI facilitator configured; live verification and settlement must still be tested" : "disabled: configure valid X402_EVM_PAY_TO and X402_SOLANA_PAY_TO addresses",
    note: "A payment is successful only after x402 verification and settlement. Arc is not enabled."
  }, {
    headers: { "Cache-Control": "public, max-age=60" }
  });
}
