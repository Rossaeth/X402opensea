import { NextRequest, NextResponse } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) {
 const address=request.nextUrl.searchParams.get("address");
 if(!address || address.length>100 || !/^[a-zA-Z0-9:_-]+$/.test(address)) return NextResponse.json({success:false,error:"Provide a valid wallet address using ?address=..."},{status:400});
 return openSeaGet(request,`/account/${encodeURIComponent(address)}/listings`,["limit","after","sort_by","sort_direction"]);
}
