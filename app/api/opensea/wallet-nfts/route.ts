import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) {
 const address=request.nextUrl.searchParams.get("address");
 const chain=(request.nextUrl.searchParams.get("chain")||"ethereum").toLowerCase();
 const chains=new Set(["ethereum","base","polygon","arbitrum","optimism","solana"]);
 if(!address || address.length>100 || !/^[a-zA-Z0-9:_-]+$/.test(address)) return NextResponse.json({success:false,error:"Provide a valid wallet address using ?address=..."},{status:400});
 if(!chains.has(chain)) return NextResponse.json({success:false,error:"Unsupported chain."},{status:400});
 return openSeaGet(request,`/chain/${chain}/account/${encodeURIComponent(address)}/nfts`,["limit","next"]);
}
