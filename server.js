const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 1337;

// Serves a static file
function serveStaticFile(filePath, res) {
  // Set default status to 200 OK if not already set
  if (!res.statusCode) {
    res.statusCode = 200;
  }

  // Try to read the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file read error, return 500 internal server error
      console.error(`Error reading file ${filePath}:`, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }

    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html';
    
    switch (ext) {
      case '.css':
        contentType = 'text/css';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
    }

    // Serve the file with appropriate headers
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Normalize URL: remove query string and convert to lowercase
  let pathname = req.url.split('?')[0].toLowerCase();
  
  // Remove trailing slash if present
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  console.log(`Request received for: ${pathname}`);

  // Route handling
  if (pathname === '/' || pathname === '/index') {
    serveStaticFile('./public/index.html', res);
  } 
  else if (pathname === '/about') {
    serveStaticFile('./public/about.html', res);
  } 
  else if (pathname === '/contact') {
    serveStaticFile('./public/contact.html', res);
  }
  // Handle CSS files
  else if (pathname === '/style.css') {
    serveStaticFile('./public/css/style.css', res);
  }
  else if (pathname === '/css/style.css') {
    serveStaticFile('./public/css/style.css', res);
  }
  // Handle image files - assuming they might be referenced directly from public or from an images subfolder
  else if (pathname.startsWith('/images/')) {
    serveStaticFile('./public' + pathname, res);
  }
  else if (pathname.match(/\.(jpg|jpeg|png|gif)$/)) {
    // For direct image references
    serveStaticFile('./public' + pathname, res);
  }
  else {
    // 404 Not Found
    res.statusCode = 404;
    serveStaticFile('./public/404.html', res);
  }
});

// Set the port and start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});