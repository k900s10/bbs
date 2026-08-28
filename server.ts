import { file } from "bun";
import { join } from "path";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const PUBLIC_DIR = import.meta.dir;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    // Provide dynamic Supabase configuration from environment variables
    if (pathname === "/js/config/env.js") {
      const envScript = `window.ENV = ${JSON.stringify({
        SUPABASE_URL: process.env.SUPABASE_URL || "",
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
      })};`;

      return new Response(envScript, {
        headers: {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const filePath = join(PUBLIC_DIR, pathname);
    const extMatch = pathname.match(/\.[a-zA-Z0-9]+$/);
    const ext = extMatch ? extMatch[0].toLowerCase() : "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const targetFile = file(filePath);

    return new Response(targetFile, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      },
    });
  },
  error(error) {
    return new Response(`404: Not Found or Server Error\n${error.message}`, { status: 404 });
  },
});

console.log(`🚀 Bun server running at http://localhost:${server.port}`);
