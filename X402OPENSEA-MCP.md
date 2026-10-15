# X402 OpenSea — in-chat NFT UI

This integration extends the existing MCP endpoint and adds a visual resource for NFT cards. It does not redesign the main website.

## Endpoint
- MCP endpoint: `https://402opensea.vercel.app/mcp`
- Visual resource: `ui://x402opensea/nft-market.html`
- Existing read-only tools include `top_collections`, `trending_collections`, and the added `nfts_in_collection`. The server retains its existing collection, listings, offers, and wallet analytics tools.

## What the widget does
- Displays actual collection/NFT image URLs and metadata returned by OpenSea API endpoints.
- Links to the original OpenSea collection page for inspection.
- Does not claim that buying or selling is available inside the widget.
- Provides ChatGPT output-template metadata; actual rendering must be verified after connecting the MCP server in the intended ChatGPT client. Other clients may need their own supported UI conventions.

## Safety
- Keep `X402_PAYMENTS_ENABLED` unset or `false` until the owner explicitly approves enabling payments.
- The widget is read-only. It does not sign wallet transactions or make purchases.
- If an API returns HTTP 402, no payment is made automatically by this widget.
