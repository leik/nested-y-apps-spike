YUI.add('app-nestanator', function (Y, NAME) {

"use strict";
function AppNestanator() {
}

AppNestanator.prototype = {
	nestApp: function(AppConstructorFn, rootPathToApp, containerNode, config) {
		var appConfig,
			app;

		appConfig = {
			container: containerNode,
			root: rootPathToApp,
			// Null out the linkSelector as this Y.App is already listening for Pjax link clicks.
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

		Y.log('Loading app. rootPathToApp: "' + rootPathToApp + '", root: "' + appConfig.root + '"');

		app = new AppConstructorFn(appConfig);

		app.addTarget(this);

		app.render().dispatch();

		return app;
	},

	uprootApp: function(app) {
		app.removeTarget(this);
		app.destroy();
	}
};

Y.namespace('SPIKE').AppNestanator = AppNestanator;


}, '@VERSION@', {"requires": []});
