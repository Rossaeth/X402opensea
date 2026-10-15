import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const evmPayTo = process.env.X402_EVM_PAY_TO;
  const svmPayTo = process.env.X402_SOLANA_PAY_TO;
  const configured = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo) && svmPayTo);

  return NextResponse.json({
    app: "x402 OpenSea",
    protocol: "x402 v2",
    price: "0.01 USDC",
    networks: [
      { id: "eip155:8453", name: "Base", asset: "USDC", enabled: Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo)) },
      { id: "solana:mainnet", name: "Solana", asset: "USDC", enabled: Boolean(svmPayTo) },
      { id: "eip155:5042002", name: "Arc Testnet", asset: "USDC", enabled: Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo)) }
    ],
    paymentVerification: configured ? "middleware configured; verify deployment environment and facilitator support" : "not configured",
    note: "Do not treat a payment as complete unless the x402 server verifies it."
  });
}