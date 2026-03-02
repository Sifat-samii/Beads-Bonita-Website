import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "../../public/logo.png");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
