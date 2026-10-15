# x402 OpenSea

A Next.js marketplace starter for x402 v2. The UI is a marketplace concept; payments must not be presented as successful until the server verifies the x402 payment payload.

## Networks planned

- Base mainnet USDC — CAIP-2 `eip155:8453`
- Solana mainnet USDC — CAIP-2 `solana:mainnet`
- Arc is represented as **Arc Testnet** (`eip155:5042002`) until the desired Arc network and USDC contract are confirmed. Do not label it Arc mainnet without verifying the chain.

## Environment variables

Set these in Vercel Project Settings → Environment Variables:

- `X402_EVM_PAY_TO`: receiving EVM address, e.g. a valid `0x...` address you control
- `X402_SOLANA_PAY_TO`: receiving Solana address you control
- Configure a supported x402 v2 facilitator and register EVM/Solana exact schemes before enabling paid endpoints.

Never commit private keys, seed phrases, or API secrets.

## Current implementation status

- Marketplace landing page: implemented.
- Status endpoint: `GET /api/status`.
- Paid resource placeholder: `GET /api/paid` returns HTTP 503 until server-side x402 middleware and receiving addresses are configured.
- No fake payment success: the current placeholder does not claim that funds were received.

## Deploy

Import this repository into Vercel with the project root set to the repository root. Framework preset: Next.js. Build command: `npm run build`. Install command: `npm install`.

The paid route must remain disabled until a real facilitator-backed x402 v2 verification flow is installed and tested on the target networks.