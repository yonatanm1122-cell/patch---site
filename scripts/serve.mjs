// Minimal static server for the exported site (used for local preview and tests).
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const root = join(process.cwd(), process.env.ROOT || "out");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".mp4": "video/mp4", ".webm": "video/webm", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon",
};

async function resolve(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  let p = join(root, safe);
  if (!p.startsWith(root)) return null;
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
    await stat(p);
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  try {
    await handle(req, res);
  } catch {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end("Server error");
  }
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));

async function handle(req, res) {
  const file = await resolve(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": types[".html"] });
    return res.end(await readFile(join(root, "404.html")));
  }
  // Mirror typical static hosting: compress text assets, cache hashed build files for a year.
  const ext = extname(file);
  const headers = {
    "content-type": types[ext] || "application/octet-stream",
    "cache-control": file.includes("/_next/static/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
  };
  let body = await readFile(file);
  if (/\.(html|js|css|json|svg|txt|xml)$/.test(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = gzipSync(body);
    headers["content-encoding"] = "gzip";
  }
  res.writeHead(200, headers);
  res.end(body);
}
