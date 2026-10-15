import { NextResponse, type NextRequest } from "next/server";
import { paymentProxy } from "@x402/next";
import { x402ResourceServer } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { ExactSvmScheme } from "@x402/svm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { facilitator } from "@payai/facilitator";
import { createPaywall } from "@x402/paywall";
import { evmPaywall } from "@x402/paywall/evm";
import { svmPaywall } from "@x402/paywall/svm";

const evmPayTo = process.env.X402_EVM_PAY_TO;
const svmPayTo = process.env.X402_SOLANA_PAY_TO;
const facilitatorConfigured = Boolean(facilitator);
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

const paywall = createPaywall()
  .withNetwork(evmPaywall)
  .withNetwork(svmPaywall)
  .withConfig({ appName: "x402 OpenSea", appLogo: "https://402opensea.vercel.app/favicon.ico", testnet: false })
  .build();

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
        "/api/opensea/listing-actions": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Get wallet approval and signing steps to create an NFT listing on OpenSea",
          mimeType: "application/json",
        },
        "/api/opensea/listing-submit": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Submit a wallet-signed NFT listing to OpenSea",
          mimeType: "application/json",
        },
        "/api/opensea/buy-actions": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Get on-chain transaction data to buy an OpenSea listing; buyer wallet must sign and submit it",
          mimeType: "application/json",
        },
        "/api/opensea/sell-actions": {
          accepts: [
            { scheme: "exact", price: "$0.02", network: "eip155:8453", payTo: evmPayTo! },
            { scheme: "exact", price: "$0.02", network: SOLANA_MAINNET, payTo: svmPayTo! },
          ],
          description: "Get on-chain transaction data to accept an OpenSea offer; seller wallet must sign and submit it",
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
      undefined,
      paywall,
    )
  : null;

export async function proxy(request: NextRequest) {
  // Development mode is free by default. Enable x402 only when explicitly set
  // to X402_PAYMENTS_ENABLED=true in Vercel environment variables.
  const paymentsEnabled = process.env.X402_PAYMENTS_ENABLED === "true";

  if (!paymentsEnabled) return NextResponse.next();

  if (!paymentHandler) {
    return NextResponse.json(
      {
        error: "x402 payments were enabled but payment recipient addresses are not configured. No payment was taken.",
        configured: false,
        facilitator: "PayAI",
      },
      { status: 503 },
    );
  }

  return paymentHandler(request);
}

export const config = { matcher: ["/api/opensea/listing-actions","/api/opensea/listing-submit","/api/opensea/buy-actions","/api/opensea/sell-actions","/api/paid","/api/opensea/collections","/api/opensea/collection-details","/api/opensea/collection-stats","/api/opensea/activity","/api/opensea/listings","/api/opensea/offers","/api/opensea/wallet-nfts","/api/opensea/nft-details","/api/opensea/trending","/api/opensea/top-collections","/api/opensea/floor-prices","/api/opensea/wallet-portfolio","/api/opensea/wallet-listings","/api/opensea/wallet-offers"] };
