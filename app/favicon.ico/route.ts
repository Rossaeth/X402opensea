export const runtime = "nodejs";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#111827"/>
    <path d="M15 20h34v7H15zm0 17h23v7H15z" fill="#ffffff"/>
    <circle cx="45" cy="40" r="8" fill="#22c55e"/>
    <path d="m41 40 3 3 5-6" fill="none" stroke="#111827" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
