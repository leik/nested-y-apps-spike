YUI.add('app-nestanator', function (Y, NAME) {

"use strict";
/**
Y.App Extension for a Y.App that nests other Y.Apps inside it. Provides a function for constructing, rendering and dispatching a nested
Y.App (ensuring the appropriate configuration) and a function for uprooting a nested Y.App.

@module app-nestanator
@class AppNestanator
@constructor
@namespace SPIKE
**/
function AppNestanator() {
}

AppNestanator.prototype = {
	/**
	Nests the given Y.App inside this Y.App. The provided App (constructor function) will be constructed, rendered and dispatched. This App
	will be added as an EventTarget for the nested Y.App.

	@method nestApp
	@param {Function} AppConstructorFn constructor function for constructing the nested Y.App
	@param {String} rootPathToApp context path to the nested Y.App (including this Y.App's 'root')
	@param {Node} containerNode the Node to render the nested Y.App into
	@param {Object} [config] additional config to pass to the constructor of the nested Y.App. Note that the `container`, `root` and
					`linkSelector` config options will be ignored if provided.

	@return {App} the instance of the given Y.App that has been nested in this Y.App
	**/
	nestApp: function(AppConstructorFn, rootPathToApp, containerNode, config) {
		var appConfig,
			app;

		appConfig = {
			container: containerNode,
			root: rootPathToApp,
			// Null out the linkSelector as only the top level Y.App should be listening for Pjax link clicks.
			// See http://yuilibrary.com/yui/docs/app/#known-limitations for more info.
			linkSelector: null
		};

		if (config) {
			appConfig = Y.merge(config, appConfig);
		}

		if (!this.get('html5')) {
			// Use a separate attribute to build up PJAX links as we've lied to the nested Y.App about what its root is
			appConfig.pjaxRootPath = appConfig.root;

			// Remove the top level Y.App's 'root' from the beginning of the sub-app's 'root' otherwise clicking on sub-links results in the
			// wrong path appended after the /#
			appConfig.root = this.removeRoot(appConfig.root);
		}


		app = new AppConstructorFn(appConfig);

		app.addTarget(this);

		app.render().dispatch();

		return app;
	},

	/**
	Uproots the given App, removing this App as an EventTarget and destroying the App.

	@method uprootApp
	@param {App} app instance of the Y.App nested inside this Y.App to uproot
	**/
	uprootApp: function(app) {
		app.removeTarget(this);
		app.destroy();
	}
};

Y.namespace('SPIKE').AppNestanator = AppNestanator;


}, '@VERSION@', {"requires": []});
