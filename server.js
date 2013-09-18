var express = require('express'),
	uaParser = require('ua-parser'),

	app = express(),
	port = process.env.PORT || 8000;

app.use(express.logger());

// For the JS/CSS resources
app.use('/static', express.static(__dirname + '/web'));
app.use('/yui3', express.static(__dirname + '/yui3'));

function hasNoPushStateSupport(req) {
	var ua = uaParser.parseUA(req.headers['user-agent']),
		family = ua.family.toLowerCase(),
		majorVer = parseInt(ua.major, 10);

	// TODO: IE < 10, iOS < 5, Android < 4.2 // See http://caniuse.com/#feat=history
	return (family === 'ie' && majorVer < 10);
}

function sendIndexHtml(req, res) {
	res.header('X-UA-Compatible', 'IE=edge');
	res.sendfile('web/index.html');
}

// Matches (/:id@:ns/:appPath/)(*) and (/:appPath/)(*) then redirects a hash-based URL on browsers that don't support HTML5 pushState
app.get(/^((?:\/.+?@.+)?\/[^@]+?\/)(.+)$/, function redirectOnNoPushStateSupport(req, res) {
	var basePath;

	if (hasNoPushStateSupport(req)) {
		// Rewrite the path to be hash-based if we detect a full path on a browser that doesn't support HTML5 pushState
		basePath = req.params[0];
		res.redirect(basePath.substring(0, basePath.length - 1) + '#/' + req.params[1]);
		return;
	}

	sendIndexHtml(req, res);
});

app.get('/*', sendIndexHtml);

app.listen(port, function() {
	console.log('Listening on ' + port);
});
