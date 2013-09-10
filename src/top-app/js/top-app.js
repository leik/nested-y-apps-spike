/*global alert, console*/

var CLASS_NAMES = {
		pjax: 'spike-pjax'
	},

	MOCK_CONFIG = [{
		// /hi => Y.use('hi-app') => new Y.SPIKE.HiApp(...)
		contextPath: 'hi',
		moduleName: 'hi-app',
		namespace: 'SPIKE',
		className: 'HiApp'
	}, {
		// /bye => use('bye-app') => new Y.SPIKE.ByeApp(...)
		contextPath: 'bye',
		moduleName: 'bye-app',
		namespace: 'SPIKE',
		className: 'ByeApp'
	}],

	MOCK_PEOPLE = [{
		identifier: {
			id: 'james',
			namespace: 'human'
		},
		name: 'James'
	}, {
		identifier: {
			id: 'spock',
			namespace: 'vulcan'
		},
		name: 'Spock'
	}],

	THROBBER_HTML = '<div class="throbber-large"></div>',

	TopApp,
	_renderMenu;

_renderMenu = Y.Handlebars.compile(
	'<div class="pure-menu pure-menu-open pure-menu-horizontal">' +
		'<ul class="' + CLASS_NAMES.pjax + '">' +
			'{{#each menuItems}}' +
				'<li><a href="{{{../baseUrl}}}{{path}}" data-path="{{path}}">{{label}}</a></li>' +
			'{{/each}}' +
			'<li class="pure-menu-separator"></li>' +
			'{{#each people}}' +
				'<li><a href="{{{../rootUrl}}}{{@key}}" data-personIdentifier="{{@key}}">{{name}}</a></li>' +
			'{{/each}}' +
		'</ul>' +
	'</div>');

TopApp = Y.Base.create('top-app', Y.App, [], {
	views: {
	},

	initializer: function() {
		var modules,
			appConfigByPath = {},
			people;

		modules = Y.Array.map(MOCK_CONFIG, function(appConfig) {
			appConfigByPath[appConfig.contextPath] = appConfig;

			return appConfig.moduleName;
		});

		// Trigger a prefetch of the modules for all the sub-apps
		Y.use(modules);

		this._appConfigByPath = appConfigByPath;

		this._menuItems = [{
			label: 'Hi',
			path: 'hi'
		}, {
			label: 'Welcome',
			path: 'hi/welcome'
		}, {
			label: 'Bye',
			path: 'bye'
		}, {
			label: 'Good Riddance',
			path: 'bye/riddance'
		}];

		people = {};
		Y.each(MOCK_PEOPLE, function(person) {
			var identifier = person.identifier;
			people[identifier.id + '@' + identifier.namespace] =  person;
		});
		this._people = people;

		this.after('activePersonChange', this._updateAppMenuUrls, this);
		this.after('activeAppPathChange', this._updatePersonMenuUrls, this);
	},

	render: function() {
		var menuHtml;

		TopApp.superclass.render.apply(this, arguments);

		menuHtml = _renderMenu({
			menuItems: this._menuItems,
			people: this._people,
			baseUrl: this.get('baseUrl'),
			rootUrl: this.get('rootUrl')
		});

		this.get('container').insertBefore(menuHtml, this.get('viewContainer'));
		this._renderWelcomeScreen();

		return this;
	},

	_updateAppMenuUrls: function() {
		var container = this.get('container'),
			baseUrl;

		if (!container) {
			// Obviously haven't rendered yet, nothing to update
			return;
		}

		baseUrl = this.get('baseUrl');

		Y.each(this._menuItems, function(menuItem) {
			var path = menuItem.path,
				menuItemNode = container.one('> .pure-menu a[data-path="' + path + '"]');

			if (menuItemNode) {
				menuItemNode.setAttribute('href', baseUrl + path);
			}
		}, this);
	},

	_updatePersonMenuUrls: function() {
		var container = this.get('container'),
			rootUrl,
			activeAppPath;

		if (!container) {
			// Obviously haven't rendered yet, nothing to update
			return;
		}

		rootUrl = this.get('rootUrl');
		activeAppPath = this.get('activeAppPath');
		activeAppPath = activeAppPath ? ('/' + activeAppPath) : '';

		Y.each(this._people, function(person, personIdentifier) {
			var menuItemNode = container.one('> .pure-menu a[data-personIdentifier="' + personIdentifier + '"]');

			if (menuItemNode) {
				menuItemNode.setAttribute('href', rootUrl + personIdentifier + activeAppPath);
			}
		}, this);
	},

	_handleTopAppRouteChange: function(req) {
		var params = req.params,
			appPath = params.appPath,
			personId = params.personId && params.personNs ? (params.personId + '@' + params.personNs) : null,
			activePerson = null,
			personChanged;

		if (personId) {
			activePerson = this._people[personId];

			if (!activePerson) {
				alert('404! No such person with id "' + personId + '".');
				return;
			}
		}
		personChanged = (activePerson !== this.get('activePerson'));

		if (personChanged) {
			this._set('activePerson', activePerson);
		}

		if (appPath) {
			if (!personChanged && this.get('activeAppPath') === appPath) {
				console.log('App with path "' + appPath + '" already active, doing nothing.');
				return;
			}
			if (!this._appConfigByPath[appPath]) {
				alert('404! No registered application with path "' + appPath + '".');
				return;
			}
		}

		if (this._activeApp) {
			this._activeApp.destroy();
			this._set('activeAppPath', null);
		}

		if (appPath) {
			this._loadAndRenderApp(appPath);
		} else {
			this._renderWelcomeScreen();
		}
	},

	_renderWelcomeScreen: function() {
		this.get('viewContainer').set('text', 'Welcome to the nested Y.Apps spike!');
	},

	_loadAndRenderApp: function(appPath) {
		this.get('viewContainer').setHTML(THROBBER_HTML);
		Y.use(this._appConfigByPath[appPath].moduleName, Y.bind(this._renderApp, this, appPath));
	},

	_renderApp: function(appPath) {
		var cfg = this._appConfigByPath[appPath],
			ns = Y.namespace(cfg.namespace),
			AppFn = ns && ns[cfg.className],
			viewContainer,
			appConfig,
			activePerson,
			app;

		if (!AppFn) {
			alert('500! Failed to load application with path "' + appPath + '".');
			return;
		}

		viewContainer = this.get('viewContainer');
		viewContainer.empty();

		appConfig = {
			container: viewContainer,
			root: this.get('baseUrl') + appPath,
			linkSelector: null,
			// Important on IE 9 and below
			serverRouting: true
		};

		if (!this.get('html5')) {
			appConfig.root = this.removeRoot(appConfig.root);
		}
		console.log('Loading app with path "' + appPath + '" and root URL: "' + appConfig.root + '"');

		activePerson = this.get('activePerson');
		if (activePerson) {
			appConfig.componentContext = {
				person: activePerson
			};
		}

		app = new AppFn(appConfig);

		this._activeApp = app;
		this._set('activeAppPath', appPath);

		app.render().dispatch();
	},

	_getAttrRootUrl: function() {
		return this._normalizePath(this.get('root') + '/');
	},

	_getAttrBaseUrl: function() {
		var baseUrl = this.get('rootUrl'),
			activePerson = this.get('activePerson'),
			identifier;

		if (activePerson) {
			identifier = activePerson.identifier;
			baseUrl += identifier.id + '@' + identifier.namespace + '/';
		}

		return this._normalizePath(baseUrl);
	}
}, {
	ATTRS: {
		activePerson: {
			readOnly: true
		},

		activeAppPath: {
			readOnly: true
		},

		rootUrl: {
			readOnly: true,
			getter: '_getAttrRootUrl'
		},

		baseUrl: {
			readOnly: true,
			getter: '_getAttrBaseUrl'
		},

		routes: {
			value: [{
				path: '/:personId@:personNs',
				callbacks: '_handleTopAppRouteChange'
			}, {
				path: '/:personId@:personNs/:appPath',
				callbacks: '_handleTopAppRouteChange'
			}, {
				path: '/:personId@:personNs/:appPath/*',
				callbacks: '_handleTopAppRouteChange'
			}, {
				path: '/:appPath',
				callbacks: '_handleTopAppRouteChange'
			}, {
				path: '/:appPath/*',
				callbacks: '_handleTopAppRouteChange'
			}]
		},

		linkSelector: {
			value: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'
		}
	}
});

Y.namespace('SPIKE').TopApp = TopApp;
