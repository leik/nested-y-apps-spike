Nested Y.Apps Spike
===================

A spike for nesting [YUI App instances](http://yuilibrary.com/yui/docs/app/) for integrating independent client side applications.

Jump to:
- [how to build and run the spike](#running-the-spike)
- [how you can provide (some greatly appreciated) feedback](#questions-for-reviewers)
- [src/top-app/js/top-app.js](https://github.com/orionhealth/nested-y-apps-spike/blob/master/src/top-app/js/top-app.js) where the majority of the important code is

## Why do we want to do this?? ##

The long term goal is to have a top level application that can dynamically load and render numerous sub-applications who can themselves have various sub-routes to change their state etc.

Some of the requirements include:
- full back/forward navigation support
- ability to open different contexts and/or applications in separate browser tabs
- support at least IE 9 (which doesn't have HTML5 pushState support)
- support URL bookmarking and sharing (even between IE9 and modern browsers)

This spike proves that we can achieve this using YUI's Y.App, though some of the techniques used to achieve this still need to be ratified with the YUI team to ensure they are (or can be) officially supported.

## Questions for Reviewers ##

One of the reasons for publishing this spike was to get some feedback from the community in general and in particular from some of the YUI core team that this is a) a good idea and b) officially supported (and not pushing the boundaries well past their known limits). We are looking to use this approach for some application development starting very soon so we'd greatly appreciate feedback (by Sept 20th if possible) on the following questions:

1. Does this seem like a good (or even just viable) idea?
2. Are the following techniques used to get this working officially supported by YUI?
   * Multiple (nested) Y.Apps on the page. (As per [Y.App's known limitations](http://yuilibrary.com/yui/docs/app/#known-limitations) only the top level Y.App has a non-falsey `linkSelector`.)
   * The combination of:

     1. forcing nested Y.Apps to `serverRouting: true`, and
     2. using `removeRoot()` to strip the top Y.App's `root` from the nested Y.App's `root`

     to get the nested routing working in browsers that don't support `pushState`. See the `_renderApp()` method in top-app.js for details.

We are happy to contribute some unit tests to the YUI codebase to ensure these use cases continue to be supported if they aren't already officially supported.

### How to provide feedback ###

Any feedback at all will be greatly appreciated:
* tweet [@unkillbob](https://twitter.com/unkillbob) (or DM me for my email address)
* raise an issue (to point out any glaring problems)
* submit a pull request (if you have solutions to aforementioned glaring problems)

## Running the Spike ##

1. Install dependencies:

        $ npm install

2. Build the JS modules etc:

        $ grunt build

3. Start the web server:

        $ node server.js

4. Go to [http://localhost:8000/](http://localhost:8000/) in your browser
