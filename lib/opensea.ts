import { NextRequest, NextResponse } from "next/server";

export const OPENSEA_CHAINS = new Set(["ethereum","base","polygon","arbitrum","optimism","solana"]);

export async function openSeaGet(request: NextRequest, upstreamPath: string, allowedParams: string[] = []) {
  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) return NextResponse.json({ success:false, error:"OpenSea API key is not configured on the server." }, { status:503, headers:{"Cache-Control":"no-store"} });
  const url = new URL("https://api.opensea.io/api/v2/" + upstreamPath.replace(/^\/+/, ""));
  for (const key of allowedParams) {
    const value = request.nextUrl.searchParams.get(key);
    if (value !== null && value.length <= 500) url.searchParams.set(key, value);
  }
  try {
    const response = await fetch(url, { headers:{"X-API-KEY":apiKey, accept:"application/json"}, signal:AbortSignal.timeout(12000), cache:"no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = response.status === 401 ? "OpenSea rejected the server API key." : response.status === 403 ? "OpenSea denied access to this endpoint." : response.status === 429 ? "OpenSea rate limit reached; retry later." : "OpenSea API request failed.";
      return NextResponse.json({success:false,error:message,upstreamStatus:response.status}, {status:response.status===429?429:502,headers:{"Cache-Control":"no-store"}});
    }
    return NextResponse.json({success:true,source:"OpenSea API v2",data:payload}, {headers:{"Cache-Control":"no-store"}});
  } catch {
    return NextResponse.json({success:false,error:"Could not reach OpenSea API."},{status:502,headers:{"Cache-Control":"no-store"}});
  }
}

export function requiredQuery(request: NextRequest, key: string, maxLength = 160) {
  const value = request.nextUrl.searchParams.get(key)?.trim();
  if (!value || value.length > maxLength || value.includes("/") || value.includes("\\") || value.includes("..")) return null;
  return value;
}
