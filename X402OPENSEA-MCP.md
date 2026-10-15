# X402 OpenSea — in-chat NFT UI

This integration adds an MCP endpoint at `/mcp` and a visual NFT market resource. It does not change the website homepage.

## Endpoint
- MCP endpoint: `https://402opensea.vercel.app/mcp`
- Resource: `ui://x402opensea/nft-market.html`
- Tools: `search_nft_collections`, `get_collection_nfts`, `get_x402opensea_status`

## Configuration
Set `X402OPENSEA_API_BASE_URL` only if the backend API lives at a different origin. The default is `https://402opensea.vercel.app`.

## Important
- `X402_PAYMENTS_ENABLED` must remain unset or `false` until the owner explicitly approves enabling payments.
- Collection discovery and NFT metadata are read-only.
- The UI links to OpenSea for viewing listings. It does not claim to buy NFTs or sign wallet transactions.
- An MCP URL alone does not guarantee every client renders app UI. Connect the MCP server in the target client and test its UI support. The widget metadata currently includes ChatGPT Apps SDK output-template metadata; Claude compatibility must be verified against Claude's MCP Apps support.
