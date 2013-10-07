YUI.add('app-nestable', function (Y, NAME) {

"use strict";
function AppNestable() {
}

AppNestable.ATTRS = {
	pjaxRootPath: {
		valueFn: '_initAttrPjaxRootPath'
	}
};

AppNestable.prototype = {
	_initAttrPjaxRootPath: function() {
		return this.get('root');
	},

	getFullPathForPjax: function(path) {
		var rootPath = this.get('pjaxRootPath'),
			fullPath = path ? (rootPath + '/' + path) : rootPath;

		return this._normalizePath(fullPath);
	}
};

Y.namespace('SPIKE').AppNestable = AppNestable;


}, '@VERSION@', {"requires": []});
