/*jslint node: true */
'use strict';

/* Start Node.js instance serving files */

var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs'),
	lanIp = require('./lanIp.js'),
	colors = require('colors'),
	port = process.argv[2] || 8888;
 
http.createServer(function(request, response) {

	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);
	
	fs.exists(filename, function(exists) {

		// We have a file that doesn't exist, respond with 404
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		// We have a directory, see if we have a static index file
		if (fs.statSync(filename).isDirectory()) {
			if(fs.existsSync(path.join(filename, 'index.html'))) {
				filename = path.join(filename, 'index.html');
			}
			else if(fs.existsSync(path.join(filename, 'index.htm'))) {
				filename = path.join(filename, 'index.htm');
			}
			else if(fs.existsSync(path.join(filename, 'index.svg'))) {
				filename = path.join(filename, 'index.svg');
			}
		}
 
		fs.readFile(filename, "binary", function(err, file) {
			// Something went wrong when reading file
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			// Everything went well, return
			response.writeHead(200);
			response.write(file, "binary");
			response.end();
		});
	});

}).listen(parseInt(port, 10));

// Log IP, etc of server instance
lanIp.find(function(ip) {
	var server = 'http://' + ip + ':' + port;
	console.log('\nQuickserver running at:\n'.bold + server.inverse + '\nCTRL + C to shutdown');
});