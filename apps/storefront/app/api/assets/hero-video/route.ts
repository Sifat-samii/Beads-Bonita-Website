import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const HERO_VIDEO_PATH = path.resolve(process.cwd(), "../../public/Hero video.mp4");
const CHUNK_SIZE = 1024 * 1024;

export const runtime = "nodejs";

export async function HEAD() {
  const fileStats = await stat(HERO_VIDEO_PATH);

  return new Response(null, {
    headers: {
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
      "Content-Length": String(fileStats.size),
      "Content-Type": "video/mp4",
    },
  });
}

export async function GET(request: Request) {
  const fileStats = await stat(HERO_VIDEO_PATH);
  const rangeHeader = request.headers.get("range");

  if (!rangeHeader) {
    const file = await readFile(HERO_VIDEO_PATH);

    return new Response(file, {
      headers: {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
        "Content-Length": String(fileStats.size),
        "Content-Type": "video/mp4",
      },
    });
  }

  const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);

  if (!match) {
    return new Response("Invalid range", { status: 416 });
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : start + CHUNK_SIZE - 1;
  const end = Math.min(requestedEnd, fileStats.size - 1);

  if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= fileStats.size) {
    return new Response("Range not satisfiable", {
      status: 416,
      headers: {
        "Content-Range": `bytes */${fileStats.size}`,
      },
    });
  }

  const file = await readFile(HERO_VIDEO_PATH);
  const chunk = file.subarray(start, end + 1);

  return new Response(chunk, {
    status: 206,
    headers: {
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=3600",
      "Content-Length": String(chunk.length),
      "Content-Range": `bytes ${start}-${end}/${fileStats.size}`,
      "Content-Type": "video/mp4",
    },
  });
}
