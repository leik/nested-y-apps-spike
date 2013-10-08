YUI.add('app-nestable', function (Y, NAME) {

"use strict";
/**
Y.App Extension for Y.Apps that can be nested inside other Y.Apps. Primarily ensures any Pjax links created by this Y.App have the
correct path (as the 'root' may be redefined to be relative to another Y.App that this Y.App is nested inside of).

@module app-nestable
@class AppNestable
@constructor
@namespace SPIKE
**/
function AppNestable() {
}

AppNestable.ATTRS = {
	/**
	Full root path for this Y.App suitable for use in Pjax links (as the 'root' may be redefined to be relative to another Y.App that this
	Y.App is nested inside of).

	@attribute pjaxRootPath
	@type String
	@default this.get('root')
	**/
	pjaxRootPath: {
		valueFn: '_initAttrPjaxRootPath'
	}
};

AppNestable.prototype = {
	_initAttrPjaxRootPath: function() {
		return this.get('root');
	},

	/**
	Get the full path to a sub-resource of this Y.App suitable for use in a Pjax link (as the 'root' may be redefined to be relative to
	another Y.App that this Y.App is nested inside of).

	@method getFullPathForPjax
	@param {String} path the path to the resource to link to in the Pjax link

	@return the full path suitable for use in a Pjax link
	**/
	getFullPathForPjax: function(path) {
		var rootPath = this.get('pjaxRootPath'),
			fullPath = path ? (rootPath + '/' + path) : rootPath;

		return this._normalizePath(fullPath);
	}
};

Y.namespace('SPIKE').AppNestable = AppNestable;


}, '@VERSION@', {"requires": []});
