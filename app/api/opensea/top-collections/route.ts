import { NextRequest } from "next/server";
import { openSeaGet } from "@/lib/opensea-proxy";
export async function GET(request: NextRequest) { return openSeaGet(request, "/collections/top", ["chain","sort_by","limit","next"]); }
