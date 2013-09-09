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

	THROBBER_HTML = '<div class="throbber-large"></div>',

	TopApp,
	_renderMenu;

_renderMenu = Y.Handlebars.compile(
	'<div class="pure-menu pure-menu-open pure-menu-horizontal">' +
		'<ul class="' + CLASS_NAMES.pjax + '">' +
			'{{#each menuItems}}' +
				'<li><a href="{{{../baseUrl}}}{{path}}">{{label}}</a></li>' +
			'{{/each}}' +
		'</ul>' +
	'</div>');

TopApp = Y.Base.create('top-app', Y.App, [], {
	views: {
	},

	initializer: function() {
		var modules,
			appConfigByPath = {};

		modules = Y.Array.map(MOCK_CONFIG, function(appConfig) {
			appConfigByPath[appConfig.contextPath] = appConfig;

			return appConfig.moduleName;
		});

		// Trigger a prefetch the modules for all the sub-apps
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
	},

	render: function() {
		var menuHtml;

		TopApp.superclass.render.apply(this, arguments);

		menuHtml = _renderMenu({
			menuItems: this._menuItems,
			baseUrl: this._normalizePath(this.get('root') + '/')
		});

		this.get('container').insertBefore(menuHtml, this.get('viewContainer'));
		this._renderWelcomeScreen();

		return this;
	},

	_showNestedApp: function(req) {
		var appPath = req.params.appPath;

		if (appPath) {
			if (this._activeAppPath === appPath) {
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
			delete this._activeAppPath;
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
			app;

		if (!AppFn) {
			alert('500! Failed to load application with path "' + appPath + '".');
			return;
		}

		viewContainer = this.get('viewContainer');
		viewContainer.empty();

		appConfig = {
			container: viewContainer,
			root: this._joinURL(appPath),
			linkSelector: null,
			// Important on IE 9 and below
			serverRouting: true
		};

		if (!this.get('html5')) {
			appConfig.root = this.removeRoot(appConfig.root);
		}
		console.log('Loading app with path "' + appPath + '" and root URL: "' + appConfig.root + '"');

		app = new AppFn(appConfig);

		this._activeApp = app;
		this._activeAppPath = appPath;

		app.render().dispatch();
	}
}, {
	ATTRS: {
		routes: {
			value: [{
				path: '/:appPath',
				callbacks: '_showNestedApp'
			}, {
				path: '/:appPath/*',
				callbacks: '_showNestedApp'
			}]
		},

		linkSelector: {
			value: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'
		}
	}
});

Y.namespace('SPIKE').TopApp = TopApp;
