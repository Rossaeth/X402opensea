import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const evmPayTo = process.env.X402_EVM_PAY_TO;
  const svmPayTo = process.env.X402_SOLANA_PAY_TO;
  const evmEnabled = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo) && svmPayTo && svmPayTo.trim().length > 20);
  const svmEnabled = evmEnabled;

  return NextResponse.json({
    app: "x402 OpenSea",
    protocol: "x402 v2",
    price: "0.01 USDC",
    networks: [
      { id: "eip155:8453", name: "Base", asset: "USDC", enabled: evmEnabled },
      { id: "solana:mainnet", name: "Solana", asset: "USDC", enabled: svmEnabled },
      { id: "eip155:5042002", name: "Arc Testnet", asset: "USDC", enabled: false, note: "UI preview only; not configured in payment middleware" }
    ],
    paymentVerification: evmEnabled ? "x402 middleware configured; facilitator support must be confirmed at runtime" : "disabled: configure X402_EVM_PAY_TO and X402_SOLANA_PAY_TO",
    note: "A payment is successful only after x402 verification and settlement. Arc is not enabled."
  });
}
