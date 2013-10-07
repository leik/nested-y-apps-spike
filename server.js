var express = require('express'),
	uaParser = require('ua-parser'),

	app = express(),
	port = process.env.PORT || 8000,

	ROOT_PATH = '/top/',
	ROOT_PATH_LENGTH = ROOT_PATH.length;

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

function redirectToRoot(req, res) {
	res.redirect(ROOT_PATH);
}

// Forward to /top/ to ensure the top-level Y.App is tested with a non-default root
app.get('/', redirectToRoot);
app.get(/\/top$/, redirectToRoot);

// Map any path through to the client to be processed by the Y.App.
app.get(ROOT_PATH + '*', function(req, res) {

	if (req.path.length > ROOT_PATH_LENGTH && hasNoPushStateSupport(req)) {
		// Rewrite the path to be hash-based if we detect a full path on a browser that doesn't support HTML5 pushState
		res.redirect(ROOT_PATH + '#' + req.path.substring(ROOT_PATH_LENGTH - 1));
		return;
	}

	res.header('X-UA-Compatible', 'IE=edge');
	res.sendfile('web/index.html');
});

app.listen(port, function() {
	console.log('Listening on ' + port);
});
