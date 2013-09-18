YUI.add('hi-app', function (Y, NAME) {

"use strict";
var CLASS_NAMES = {
		pjax: 'spike-pjax'
	},

	HiApp,
	_renderLinks,
	_renderContent;

_renderLinks = Y.Handlebars.compile(
	'<div class="pure-menu pure-menu-open pure-menu-horizontal">' +
		'<ul class="' + CLASS_NAMES.pjax + '">' +
			'{{#each greetings}}' +
				'<li><a href="{{{../baseUrl}}}{{@key}}">{{short}}</a></li>' +
			'{{/each}}' +
		'</ul>' +
	'</div>');

_renderContent = Y.Handlebars.compile(
	'<h2>Hi</h2>' +
	'<p>' +
		'{{#if name}}Hello {{name}}!{{else}}Hi!{{/if}}' +
		'{{#if greeting}} {{greeting.long}}{{/if}}' +
	'</p>');

function ensureTrailingSlash(urlStr) {
	return urlStr.charAt(urlStr.length - 1) === '/' ? urlStr : urlStr + '/';
}

HiApp = Y.Base.create('hi-app', Y.App, [], {
	views: {
	},

	initializer: function() {
		this._greetings = {
			'welcome': {
				'short': 'Welcome',
				'long': 'Welcome to my spike!'
			},
			'stay': {
				'short': 'Please Stay',
				'long': 'Please stay a while, make yourself at home!'
			}
		};
	},

	render: function() {
		HiApp.superclass.render.apply(this, arguments);

		var links = _renderLinks({
			baseUrl: ensureTrailingSlash(this.get('root')),
			greetings: this._greetings
		});

		this.get('container').insertBefore(links, this.get('viewContainer'));

		return this;
	},

	_renderInnerAppContent: function() {
		var componentContext = this.get('componentContext'),
			person = componentContext && componentContext.person;

		this.get('viewContainer').setHTML(_renderContent({
			name: person && person.name,
			greeting: this._activeGreeting
		}));
	},

	_handleInnerAppRoute: function(req) {
		this._activeGreeting = this._greetings[req.params.greeting];
		this._renderInnerAppContent();
	}
}, {
	ATTRS: {
		componentContext: {
			writeOnce: 'initOnly'
		},

		routes: {
			value: [{
				path: '/',
				callbacks: '_handleInnerAppRoute'
			}, {
				path: '/:greeting',
				callbacks: '_handleInnerAppRoute'
			}, {
				path: '/:greeting/*',
				callbacks: '_handleInnerAppRoute'
			}]
		},

		linkSelector: {
			value: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'
		}
	}
});

Y.namespace('SPIKE').HiApp = HiApp;


}, '@VERSION@', {"requires": ["app-base", "base", "handlebars"]});
