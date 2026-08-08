// Artispreneur Contract Agent — Local Dev Server
// Serves static files + proxies /api/* to Vercel serverless functions
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Load the API handlers
const agentHandler = require('./api/agent');
const templatesHandler = require('./api/templates');

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// Create server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // Parse JSON body for API routes
  let body = {};
  if (req.method === 'POST' && req.headers['content-type']?.includes('application/json')) {
    body = await new Promise((resolve) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    });
  }

  // Route to API handlers
  if (pathname === '/api/agent') {
    req.body = body;
    return agentHandler(req, res);
  }
  if (pathname === '/api/templates') {
    req.query = Object.fromEntries(url.searchParams);
    return templatesHandler(req, res);
  }

  // Serve static files
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // If no extension, try .html
  if (!path.extname(filePath)) {
    filePath += '.html';
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    // SPA fallback for app.html routes
    try {
      const fallback = fs.readFileSync(path.join(__dirname, 'app.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(fallback);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 — Not Found</h1>');
    }
  }
});

server.listen(PORT, () => {
  console.log(`\n  🎵 Artispreneur Contract Agent`);
  console.log(`  Local preview: http://localhost:${PORT}\n`);
  console.log(`  Press Ctrl+C to stop\n`);
});