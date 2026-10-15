import { NextRequest } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) { return openSeaGet(request, "/collections/trending", ["chain","timeframe","limit","next"]); }
