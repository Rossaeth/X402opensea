import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const evmPayTo = process.env.X402_EVM_PAY_TO;
  const svmPayTo = process.env.X402_SOLANA_PAY_TO;
  if (!evmPayTo || !/^0x[a-fA-F0-9]{40}$/.test(evmPayTo) || !svmPayTo) {
    return NextResponse.json(
      { error: "x402 payments are not configured yet. Set X402_EVM_PAY_TO and X402_SOLANA_PAY_TO in the deployment environment." },
      { status: 503 }
    );
  }

  return NextResponse.json({
    error: "Payment middleware is not active for this request. Configure a supported facilitator and network schemes before serving paid content."
  }, { status: 503 });
}