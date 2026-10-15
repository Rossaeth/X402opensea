import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    return NextResponse.json({
      error: "NFT upload is not configured. Add PINATA_JWT to the Vercel project environment variables.",
      configured: false,
    }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const image = form.get("image");
    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json({ error: "Image must be PNG, JPG, WEBP, or GIF." }, { status: 400 });
    }
    if (image.size <= 0 || image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image must be smaller than 10 MB." }, { status: 413 });
    }
    if (!name || name.length > 100 || !description || description.length > 1000) {
      return NextResponse.json({ error: "Name (1–100 characters) and description (1–1000 characters) are required." }, { status: 400 });
    }

    const imageForm = new FormData();
    imageForm.append("file", image, image.name || "nft-artwork");
    imageForm.append("pinataMetadata", JSON.stringify({ name: `${name} - artwork` }));

    const imageResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: imageForm,
      cache: "no-store",
    });
    const imageResult = await imageResponse.json().catch(() => ({}));
    if (!imageResponse.ok || typeof imageResult.IpfsHash !== "string") {
      return NextResponse.json({
        error: "Pinata failed to upload the image.",
        details: imageResult.error?.details ?? imageResult.error ?? imageResult.message ?? "Unknown upload error",
      }, { status: 502 });
    }

    const metadata = {
      name,
      description,
      image: `ipfs://${imageResult.IpfsHash}`,
      attributes: [
        { trait_type: "Collection", value: "X402 Digital Collectibles" },
        { trait_type: "Network", value: "Base" },
      ],
    };

    const metadataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pinataMetadata: { name: `${name} - metadata` },
        pinataContent: metadata,
      }),
      cache: "no-store",
    });
    const metadataResult = await metadataResponse.json().catch(() => ({}));
    if (!metadataResponse.ok || typeof metadataResult.IpfsHash !== "string") {
      return NextResponse.json({
        error: "The image uploaded, but Pinata failed to upload the metadata JSON.",
        imageUri: metadata.image,
        details: metadataResult.error?.details ?? metadataResult.error ?? metadataResult.message ?? "Unknown upload error",
      }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      imageUri: metadata.image,
      metadataUri: `ipfs://${metadataResult.IpfsHash}`,
      metadataGatewayUrl: `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`,
      metadata,
    });
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }
}
