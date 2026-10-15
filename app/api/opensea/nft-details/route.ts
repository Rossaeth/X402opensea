import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) {
 const chain=(request.nextUrl.searchParams.get("chain")||"ethereum").toLowerCase();
 const contract=request.nextUrl.searchParams.get("contract");
 const tokenId=request.nextUrl.searchParams.get("token_id");
 const chains=new Set(["ethereum","base","polygon","arbitrum","optimism"]);
 if(!chains.has(chain)) return NextResponse.json({success:false,error:"Unsupported EVM chain."},{status:400});
 if(!contract || !/^0x[a-fA-F0-9]{40}$/.test(contract) || !tokenId || !/^\\d{1,100}$/.test(tokenId)) return NextResponse.json({success:false,error:"Provide contract=0x... and token_id=..."},{status:400});
 return openSeaGet(request,`/chain/${chain}/contract/${contract}/nfts/${encodeURIComponent(tokenId)}`,[]);
}
