var CLASS_NAMES = {
		pjax: 'spike-pjax'
	},

	ByeApp,
	_renderLinks,
	_renderContent;

_renderLinks = Y.Handlebars.compile(
	'<div class="pure-menu pure-menu-open pure-menu-horizontal">' +
		'<ul class="' + CLASS_NAMES.pjax + '">' +
			'{{#each farewells}}' +
				'<li><a href="{{{../baseUrl}}}{{@key}}">{{short}}</a></li>' +
			'{{/each}}' +
		'</ul>' +
	'</div>');

_renderContent = Y.Handlebars.compile(
	'<h2>Bye</h2>' +
	'<p>' +
		'Goodbye{{#if name}} {{name}}{{/if}}' +
		'{{#if farewell}}, {{farewell.long}}{{else}}.{{/if}}' +
	'</p>');

ByeApp = Y.Base.create('bye-app', Y.App, [], {
	views: {
	},

	initializer: function() {
		this._farewells = {
			'seeya': {
				'short': 'See Ya',
				'long': 'see you next time.'
			},
			'riddance': {
				'short': 'Good Riddance',
				'long': 'and good riddance!'
			}
		};
	},

	render: function() {
		ByeApp.superclass.render.apply(this, arguments);

		var links = _renderLinks({
			baseUrl: this._normalizePath(this.get('root') + '/'),
			farewells: this._farewells
		});

		this.get('container').insertBefore(links, this.get('viewContainer'));

		return this;
	},

	_renderInnerAppContent: function() {
		var componentContext = this.get('componentContext'),
			person = componentContext && componentContext.person;

		this.get('viewContainer').setHTML(_renderContent({
			name: person && person.name,
			farewell: this._activeFarewell
		}));
	},

	_handleInnerAppRoute: function(req) {
		this._activeFarewell = this._farewells[req.params.farewell];
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
				path: '/:farewell',
				callbacks: '_handleInnerAppRoute'
			}, {
				path: '/:farewell/*',
				callbacks: '_handleInnerAppRoute'
			}]
		},

		linkSelector: {
			value: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'
		}
	}
});

Y.namespace('SPIKE').ByeApp = ByeApp;
