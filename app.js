var http = require ('http');
var httpproxy = require ('http-proxy');
var config = require ('./config.json');

var proxy = httpproxy.createProxyServer({});

proxy.on ('error', function (err, req, res) {
	res.writeHead (500, {
		'Content-Type': 'text/plain'
	});
	res.end('Server down. We will be back in a momment');
});

var server = require('express')();
server.use((req, res) => {
	var host = req.headers.host, ip = req.headers['x-forwarded-for'] 
		|| req.connection.remoteAddress;
	console.log("client ip:" + ip + ", host:" + host);

	if (config[host]) {
		if (config[host].target) {
			
			proxy.web(req, res, { target: config[host].target });
		}
		else if (config[host].redirect){
			res.redirect(config[host].redirect);
			res.end();
		}

	} else {
		res.writeHead(200, {   
			'Content-Type': 'text/plain'
		});
		res.end('Welcome!');
	}
});

console.log("listening on port 80")
server.listen(8080);
