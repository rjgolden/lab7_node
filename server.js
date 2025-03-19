// Load the http module.
var http = require('http');
// Load the file system module.
var fs = require('fs');
var path = require('path');
// Create a variable that stores the port number (i.e., 1337) at the beginning of your program.
var port = 1337;


// Define the public directory that contains the HTML (and related) files.
var publicDir = path.join(__dirname, 'public');


/*
 * Function: serveStaticFile
 * Reads the file located at the path being passed in.
 * Checks if there is no HTTP status message and sets it to the code telling the browser that everything is okay.
 * Tries to read the file. If there is an error, it tells the browser that there was an internal error.
 * Otherwise, it provides the browser with the response code, content type and data that was passed in.
 */
function serveStaticFile(response, filePath, contentType, responseCode) {
    responseCode = responseCode || 200;
    fs.readFile(filePath, function(err, data) {
        if (err) {
            console.error("Error reading file:", filePath, err);
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('500 - Internal Error');
        } else {
            response.writeHead(responseCode, {'Content-Type': contentType});
            response.end(data);
        }
    });
}


// Helper function to get MIME type for images
function getMimeType(ext) {
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}


// Use the createServer method from the http module to create an HTTP server.
var server = http.createServer(function(request, response) {
    // Normalize the URL by removing the querystring, optional trailing slash, and making it lowercase.
    var parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    var pathname = parsedUrl.pathname.toLowerCase().replace(/\/$/, '');
   
    // Serve each web page based on the path that a user has navigated to.
    if (pathname === '' || pathname === '/index') {
        // Serve the index page if root or /index is requested.
        serveStaticFile(response, path.join(publicDir, 'index.html'), 'text/html', 200);
    } else if (pathname.endsWith('.html')) {
        // Serve any HTML file under the public folder.
        serveStaticFile(response, path.join(publicDir, pathname), 'text/html', 200);
    } else if (pathname.endsWith('.css')) {
        // Serve the CSS file inside the css folder under the public folder.
        serveStaticFile(response, path.join(publicDir, pathname), 'text/css', 200);
    } else if (pathname.startsWith('/images/')) {
        // Serve each image inside the images folder under the public folder.
        var ext = path.extname(pathname);
        var mimeType = getMimeType(ext);
        serveStaticFile(response, path.join(publicDir, pathname), mimeType, 200);
    } else {
        // Default case: serve the 404 page from the public folder and set the HTTP status code to 404.
        serveStaticFile(response, path.join(publicDir, '404.html'), 'text/html', 404);
    }
});


// Tell the server what port to be on.
server.listen(port, function() {
    // Output the URL to access the server to the console.
    console.log('Server is running at: http://localhost:' + port);
});
