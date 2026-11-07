// Server local pentru previzualizare (simulează Netlify: fallback SPA + Netlify Forms).
// Pornire: node dev-server.js   →   http://localhost:8080
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "site"), PORT = +process.env.PORT || 8080;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml" };

http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");
  if (req.method == "POST") {
    let body = ""; req.on("data", c => body += c); req.on("end", () => {
      const f = new URLSearchParams(body);
      if (!f.get("form-name")) { res.writeHead(404); return res.end() }
      console.log(`\n[Netlify Forms simulat] formular „${f.get("form-name")}”:`); for (const [k, v] of f) console.log(`  ${k}: ${v.replace(/\n/g, "\n    ")}`);
      res.writeHead(200, { "Content-Type": "text/plain" }); res.end("ok");
    }); return;
  }
  let file = path.normalize(path.join(ROOT, decodeURIComponent(u.pathname)));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end() }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    if (path.extname(u.pathname)) { res.writeHead(404); return res.end("404") }
    file = path.join(ROOT, "index.html");      // redirect /* → /index.html (200)
  }
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  if (/text|javascript/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {   // ca Netlify: text comprimat
    res.writeHead(200, { "Content-Type": type, "Content-Encoding": "gzip", "Vary": "Accept-Encoding" });
    return fs.createReadStream(file).pipe(require("zlib").createGzip()).pipe(res);
  }
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`volta → http://localhost:${PORT}`));
