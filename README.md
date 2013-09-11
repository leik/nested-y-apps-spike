Nested Y.Apps Spike
===================

A spike for nesting [YUI App instances](http://yuilibrary.com/yui/docs/app/) for integrating independent client side applications.

Jump to:
- [how to build and run the spike](#running-the-spike)
- [src/top-app/js/top-app.js](https://github.com/orionhealth/nested-y-apps-spike/blob/master/src/top-app/js/top-app.js) where the majority of the important code is

## Why would you do this?? ##

The long term goal is to have a top level application that can dynamically load and render numerous sub-applications who can themselves have various sub-routes to change their state etc.

Some of the requirements include:
- full back/forward navigation support
- ability to open different contexts and/or applications in separate browser tabs
- support at least IE 9 (which doesn't have HTML5 pushState support)
- support URL bookmarking and sharing (even between IE9 and modern browsers)

This spike proves that we can achieve this using YUI's Y.App, though some of the techniques used to achieve this still need to be ratified with the YUI team to ensure they are officially supported (and not completely insane).

## Running the Spike ##

1. Install dependencies:

        $ npm install

2. Build the JS modules etc:

        $ grunt build

3. Start the web server:

        $ node server.js

4. Go to [http://localhost:8000/](http://localhost:8000/) in your browser
