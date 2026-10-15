import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) {
 const slug=request.nextUrl.searchParams.get("slug");
 if(!slug || !/^[a-zA-Z0-9-]{1,100}$/.test(slug)) return NextResponse.json({success:false,error:"Provide a valid collection slug using ?slug=..."},{status:400});
 return openSeaGet(request,`/collections/${encodeURIComponent(slug)}/floor_prices`,["timeframe"]);
}
