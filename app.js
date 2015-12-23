var http = require ('http');
var httpproxy = require ('http-proxy');

var proxy = httpproxy.createProxyServer({

});

proxy.on ('error', function (err, req, res) {
	res.writeHead (500, {
		'Content-Type': 'text/plain'
	});
	res.end('Server down. We will be back in a momment');
});

var server = require ('http').createServer(function (req, res) {
	var host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log("client ip:" + ip + ", host:" + host);

	switch (host) {
		case 'stzone.org':
		case 'www.stzone.org':
			proxy.web (req, res, {
				target: 'http://localhost:4567'});
			break;

		case 'deploy.skye.kiwi':
			proxy.web (req, res, {
				target: 'http://localhost:7777'});
			break;

		default:
			res.writeHead(200, {
				    'Content-Type': 'text/plain'
			});
			res.end('Welcome!');
	}



});

console.log("listening on port 80")
server.listen(8080);
