Nested Y.Apps Spike
===================

A spike (prototype/experiment) for nesting [YUI App instances](http://yuilibrary.com/yui/docs/app/) for integrating independent client side applications.

Jump to:
- [a running instance of the spike on Heroku](http://nested-y-apps-spike.herokuapp.com/)
- [how to build and run the spike](#running-the-spike)

## Update: Outcomes ##

We consider the spike successful in that we achieved the desired functionality in the targeted browsers.

In browsers with HTML5 pushState support everything just works intuitively.

In browsers that don't support HTML5 pushState we had to implement a single workaround to get things working (in addition to YUI's built-in fallback to hash-based client side navigation). However we felt that if we were placed in YUI's shoes we wouldn't want to officially support this scenario. We decided to abstract the workaround into our own Y.App extensions for which we can provide our own unit testing to ensure it isn't broken in a future YUI release (and deal with it if it is).

### Workaround for non-HTML5 Browsers ###

There was one workaround that needed to be implemented for browsers that don't support HTML5 pushState (Internet Explorer < 10, Android < 4.2).


When initializing the nested Y.App we remove the top level App's root from the nested Y.App's root:

    appConfig.root = this.removeRoot(appConfig.root);

which results in a root path of e.g. `/hi/...` if say the full path was `/top/hi/...`. This adjustment causes all routing and navigation within the nested App to work correctly with one caveat: any attempt to build a full URL (e.g. to set as the `href` of a link intended for Pjax) results in an incorrect URL (e.g. `http://server/hi/...` instead of `http://server/top/hi/...`). To counter this we pass an additional attribute to the nested App to use for building full paths for Pjax links (before removing the top level App's root from the nested App's root path):

    appConfig.pjaxRootPath = appConfig.root;

This functionality is wrapped in the two App extensions `app-nestable` (for nestable Apps to mix in) and `app-nestanator` (for Apps that nest other Apps to mix in) to abstract this workaround away from Apps that wish to use this nesting functionality.

### How to provide feedback ###

Any feedback at all will be greatly appreciated, but we're especially interested to hear from you if you have or are thinking about doing similar things with nesting Y.Apps:
* tweet [@unkillbob](https://twitter.com/unkillbob) (or DM me for my email address)
* raise an issue
* submit a pull request

## Original Goals: Why do we want to do this?? ##

The long term goal is to have a top level application that can dynamically load and render numerous sub-applications who can themselves have various sub-routes to change their state etc.

Some of the requirements include:
- full back/forward navigation support
- ability to open different contexts and/or applications in separate browser tabs
- support at least IE 9 (which doesn't have HTML5 pushState support)
- support URL bookmarking and sharing (even between IE9 and modern browsers)

This spike proves that we can achieve this using YUI's Y.App, though we had to build a couple of extensions that workaround some of the quirks in browsers that don't support HTML5 pushState.

## Running the Spike ##

Ensure you have [Node.js](http://nodejs.org/) and [Grunt.js](http://gruntjs.com/) installed.

1. Install dependencies:

        $ npm install

2. Build the JS modules etc:

        $ grunt build

3. Start the web server:

        $ node server.js

4. Go to [http://localhost:8000/](http://localhost:8000/) in your browser
