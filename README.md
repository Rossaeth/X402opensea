# x402 OpenSea

A Next.js marketplace starter using the x402 v2 HTTP payment protocol.

## Networks

- Base mainnet USDC (eip155:8453): enabled by server middleware when configured.
- Solana mainnet USDC (solana:mainnet): enabled by server middleware when configured.
- Arc is displayed as Arc Testnet in the UI but is not enabled for payment. Confirm the target Arc network, USDC asset and facilitator support before enabling it.

The sample item costs 0.01 USDC. Listings and artwork are demonstration content, not actual NFTs.

## Configure Vercel

In Vercel Project Settings, add these environment variables:

- X402_EVM_PAY_TO: your receiving EVM wallet address for Base.
- X402_SOLANA_PAY_TO: your receiving Solana wallet address.
- X402_FACILITATOR_URL (optional): facilitator URL; defaults to https://x402.org/facilitator.

Redeploy after setting environment variables. Use only wallet addresses you control. Never commit private keys, seed phrases or API secrets.

## Payment behavior

- GET /api/status reports configuration.
- GET /api/paid is protected by x402 v2 middleware and requests 0.01 USDC on Base or Solana.
- If receiving addresses are missing, the route returns HTTP 503 and states that payment is disabled.
- The UI does not claim a payment succeeded unless the server middleware verifies and settles it.
- Arc payment selection is informational only until a supported network and facilitator configuration are verified.

## Deploy

Import this repository into Vercel as a Next.js project with the repository root as project root. Install command: npm install. Build command: npm run build.

Official protocol reference: https://github.com/x402-foundation/x402
