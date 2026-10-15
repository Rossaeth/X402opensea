import { NextResponse, type NextRequest } from "next/server";
import { paymentProxy } from "@x402/next";
import { x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { facilitator } from "@payai/facilitator";

const evmPayTo = process.env.X402_EVM_PAY_TO;
const svmPayTo = process.env.X402_SOLANA_PAY_TO;
const facilitatorConfigured = true;
const evmValid = Boolean(evmPayTo && /^0x[a-fA-F0-9]{40}$/.test(evmPayTo));
const svmValid = Boolean(svmPayTo && svmPayTo.trim().length > 20);

// CAIP-2 identifier for Solana mainnet-beta.
const SOLANA_MAINNET = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

const paymentServer = (() => {
  // PayAI public facilitator supports x402 v2 on Base and Solana.
  const facilitatorClient = new HTTPFacilitatorClient(facilitator);
  const server = new x402ResourceServer(facilitatorClient);
  server.register("eip155:8453", new ExactEvmScheme());
  server.register(SOLANA_MAINNET, new ExactSvmScheme());
  return server;
})();

const paymentHandler = evmValid && svmValid && facilitatorConfigured
  ? paymentProxy(
      {
        "/api/opensea/collections": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection listings",
          mimeType: "application/json",
        },
        "/api/opensea/collection-details": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection metadata",
          mimeType: "application/json",
        },
        "/api/opensea/collection-stats": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection statistics",
          mimeType: "application/json",
        },
        "/api/opensea/activity": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection sales and activity events",
          mimeType: "application/json",
        },
        "/api/opensea/listings": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection listings",
          mimeType: "application/json",
        },
        "/api/opensea/offers": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch OpenSea collection offers",
          mimeType: "application/json",
        },
        "/api/opensea/wallet-nfts": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch NFTs owned by a wallet from OpenSea",
          mimeType: "application/json",
        },
        "/api/opensea/nft-details": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch an OpenSea NFT by contract and token ID",
          mimeType: "application/json",
        },
        "/api/opensea/trending": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch trending OpenSea collections",
          mimeType: "application/json",
        },
        "/api/opensea/top-collections": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch top OpenSea collections",
          mimeType: "application/json",
        },
        "/api/opensea/floor-prices": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch collection floor price history",
          mimeType: "application/json",
        },
        "/api/opensea/wallet-portfolio": {
          accepts: [
            { scheme: "exact", price: "$0.03", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.03", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch account portfolio analytics",
          mimeType: "application/json",
        },
        "/api/opensea/wallet-listings": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch active listings created by an account",
          mimeType: "application/json",
        },
        "/api/opensea/wallet-offers": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Fetch active offers made by an account",
          mimeType: "application/json",
        },
        "/api/paid": {
          accepts: [
            { scheme: "exact", price: "$0.01", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.01", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Unlock demo digital collectible access",
          mimeType: "application/json",
        },
      },
      paymentServer,
      { appName: "x402 OpenSea", testnet: false },
    )
  : null;

export async function proxy(request: NextRequest) {
  const protectedPaths = ["/api/paid","/api/opensea/collections","/api/opensea/collection-details","/api/opensea/collection-stats","/api/opensea/activity","/api/opensea/listings","/api/opensea/offers","/api/opensea/wallet-nfts","/api/opensea/nft-details","/api/opensea/trending","/api/opensea/top-collections","/api/opensea/floor-prices","/api/opensea/wallet-portfolio","/api/opensea/wallet-listings","/api/opensea/wallet-offers"];
  if (protectedPaths.includes(request.nextUrl.pathname) && !paymentHandler) {
    return NextResponse.json(
      {
        error: "x402 payments are disabled until valid X402_EVM_PAY_TO and X402_SOLANA_PAY_TO addresses are configured. No payment was taken.",
        configured: false,
        facilitator: "PayAI",
      },
      { status: 503 },
    );
  }

  if (paymentHandler) return paymentHandler(request);
  return NextResponse.next();
}

export const config = { matcher: ["/api/paid","/api/opensea/collections","/api/opensea/collection-details","/api/opensea/collection-stats","/api/opensea/activity","/api/opensea/listings","/api/opensea/offers","/api/opensea/wallet-nfts","/api/opensea/nft-details","/api/opensea/trending","/api/opensea/top-collections","/api/opensea/floor-prices","/api/opensea/wallet-portfolio","/api/opensea/wallet-listings","/api/opensea/wallet-offers"] };
