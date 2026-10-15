import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API = "https://api.opensea.io/api/v2";
export async function openSeaGet(request: NextRequest, path: string, allowed: string[] = ["limit"]) {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) return NextResponse.json({success:false,error:"OpenSea API key is not configured on the server."},{status:503});
  const url = new URL(API + path);
  for (const name of allowed) {
    const value = request.nextUrl.searchParams.get(name);
    if (value !== null && value.length <= 200) url.searchParams.set(name, value);
  }
  try {
    const upstream = await fetch(url, {headers:{"X-API-KEY":key,accept:"application/json"},cache:"no-store",signal:AbortSignal.timeout(12000)});
    const body = await upstream.json().catch(()=>({}));
    if (!upstream.ok) return NextResponse.json({success:false,error:upstream.status===429?"OpenSea rate limit reached. Try again later.":`OpenSea API returned HTTP ${upstream.status}.`,upstreamStatus:upstream.status},{status:upstream.status===429?429:502,headers:{"Cache-Control":"no-store"}});
    return NextResponse.json({success:true,source:"OpenSea API v2",data:body},{headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({success:false,error:"Could not reach OpenSea API."},{status:502,headers:{"Cache-Control":"no-store"}});
  }
}
