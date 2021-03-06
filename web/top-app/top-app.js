YUI.add('top-app', function (Y, NAME) {

"use strict";
/*global alert*/

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
	_renderMenu,
	updateHref;

_renderMenu = Y.Handlebars.compile(
	'<div class="pure-menu pure-menu-open pure-menu-horizontal">' +
		'<ul class="' + CLASS_NAMES.pjax + '">' +
			'<li><a href="{{{baseUrl}}}">Home</a></li>' +
			'{{#each menuItems}}' +
				'<li><a href="{{{../baseUrl}}}{{path}}/" data-path="{{path}}">{{label}}</a></li>' +
			'{{/each}}' +
			'<li class="pure-menu-separator"></li>' +
			'{{#each people}}' +
				'<li><a href="{{{../rootUrl}}}{{@key}}/" data-personIdentifier="{{@key}}">{{name}}</a></li>' +
			'{{/each}}' +
		'</ul>' +
	'</div>');

// IE 9 (at least) exhibits a bug whereby progammatically updating an anchor's href attribute causes all other URL properties (e.g. host,
// port, etc) to be reset to blank. Some of these properties are used by YUI's Pjax utility to check for same-origin to determine whether
// to let a link-click go to the server or navigate via the Router. For this reason we have to (on browsers that exhibit the bug) copy all
// these properties off the anchor element and restore them after updating the href.
// TODO: when this is more than a spike this method should be in its own module and very thoroughly unit tested
updateHref = (function() {
	var updateProperties,
		propertiesToSave = ['hash', 'host', 'hostname', 'port', 'protocol', 'search'];

	return function(anchorNode, newUrl) {
		var href = anchorNode.get('href'),
			pathname = anchorNode.get('pathname'),
			properties = {};

		if (newUrl === href || newUrl === pathname ||
			newUrl === '/' + pathname) { // Some versions of IE don't include the leading "/" in the pathname attribute
			return;
		}

		if (updateProperties === false) {
			// We've been through here before and concluded this browser does not exhibit the bug, we can safely just update the href
			anchorNode.set('href', newUrl);
			return;
		}

		Y.each(propertiesToSave, function(propName) {
			properties[propName] = anchorNode.get(propName);
		});

		anchorNode.set('href', newUrl);

		// TODO: is this an appropriate test for the bug? what if the new URL has a diff protocol? (seems unlikely...)
		//       Maybe check for a blank hostname or something?
		if (updateProperties || anchorNode.get('protocol') !== properties.protocol) {
			updateProperties = true;
			Y.each(properties, function(propVal, propName) {
				if (propVal && anchorNode.get(propName) !== propVal) {
					anchorNode.set(propName, propVal);
				}
			});
		} else {
			// This browser does not exhibit the bug, set updateProperties explicitly to false so we don't bother in future href updates
			updateProperties = false;
		}
	};
}());

TopApp = Y.Base.create('top-app', Y.App, [Y.SPIKE.AppNestanator], {
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
				updateHref(menuItemNode, baseUrl + path + '/');
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
		activeAppPath = activeAppPath ? (activeAppPath + '/') : '';

		Y.each(this._people, function(person, personIdentifier) {
			var menuItemNode = container.one('> .pure-menu a[data-personIdentifier="' + personIdentifier + '"]');

			if (menuItemNode) {
				updateHref(menuItemNode, rootUrl + personIdentifier + '/' + activeAppPath);
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
				// TODO: need to figure out how to safely and appropriately handle this error case
				alert('404! No such person with id "' + personId + '".');
				return;
			}
		}
		personChanged = (activePerson !== this.get('activePerson'));

		if (personChanged) {
			this._set('activePerson', activePerson);
		}

		if (appPath) {
			// If the activePerson and activeAppPath haven't changed, do nothing
			if (!personChanged && this.get('activeAppPath') === appPath) {
				return;
			}
			if (!this._appConfigByPath[appPath]) {
				// TODO: need to figure out how to safely and appropriately handle this error case
				alert('404! No registered application with path "' + appPath + '".');
				return;
			}
		}

		if (this._activeApp) {
			this.uprootApp(this._activeApp);
			this._set('activeAppPath', null);
		}

		if (appPath) {
			this._loadAndRenderApp(appPath);
		} else {
			// Alternatively, could have a nominated (or simply first in the list) default app in place of a welcome screen?
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
			appConfig = {},
			viewContainer,
			activePerson;

		if (!AppFn) {
			alert('500! Failed to load application with path "' + appPath + '".');
			return;
		}

		viewContainer = this.get('viewContainer');
		viewContainer.empty();

		activePerson = this.get('activePerson');
		if (activePerson) {
			appConfig.componentContext = {
				person: activePerson
			};
		}

		this._activeApp = this.nestApp(AppFn, this.get('baseUrl') + appPath, viewContainer, appConfig);

		this._set('activeAppPath', appPath);
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
		// The following four attributes should probably be in a view model of some sort.

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
			// The order of these routes is important to ensure no confusion between "/appPath" and "/id@ns" as the first part of the URL
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


}, '@VERSION@', {"requires": ["app-base", "array-extras", "base", "handlebars", "app-nestanator"]});
