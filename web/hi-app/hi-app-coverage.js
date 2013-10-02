if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/hi-app/hi-app.js']) {
   __coverage__['build/hi-app/hi-app.js'] = {"path":"build/hi-app/hi-app.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":18},"end":{"line":1,"column":37}}},"2":{"name":"(anonymous_2)","line":39,"loc":{"start":{"line":39,"column":14},"end":{"line":39,"column":25}}},"3":{"name":"(anonymous_3)","line":52,"loc":{"start":{"line":52,"column":9},"end":{"line":52,"column":20}}},"4":{"name":"(anonymous_4)","line":64,"loc":{"start":{"line":64,"column":18},"end":{"line":64,"column":34}}},"5":{"name":"(anonymous_5)","line":69,"loc":{"start":{"line":69,"column":25},"end":{"line":69,"column":36}}},"6":{"name":"(anonymous_6)","line":79,"loc":{"start":{"line":79,"column":23},"end":{"line":79,"column":37}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":108,"column":66}},"2":{"start":{"line":4,"column":0},"end":{"line":11,"column":16}},"3":{"start":{"line":13,"column":0},"end":{"line":20,"column":11}},"4":{"start":{"line":22,"column":0},"end":{"line":27,"column":9}},"5":{"start":{"line":29,"column":0},"end":{"line":103,"column":3}},"6":{"start":{"line":40,"column":2},"end":{"line":49,"column":4}},"7":{"start":{"line":53,"column":2},"end":{"line":53,"column":49}},"8":{"start":{"line":55,"column":2},"end":{"line":57,"column":5}},"9":{"start":{"line":59,"column":2},"end":{"line":59,"column":71}},"10":{"start":{"line":61,"column":2},"end":{"line":61,"column":14}},"11":{"start":{"line":65,"column":2},"end":{"line":65,"column":25}},"12":{"start":{"line":66,"column":2},"end":{"line":66,"column":65}},"13":{"start":{"line":70,"column":2},"end":{"line":71,"column":56}},"14":{"start":{"line":73,"column":2},"end":{"line":76,"column":6}},"15":{"start":{"line":80,"column":2},"end":{"line":80,"column":62}},"16":{"start":{"line":81,"column":2},"end":{"line":81,"column":32}},"17":{"start":{"line":105,"column":0},"end":{"line":105,"column":35}}},"branchMap":{"1":{"line":71,"type":"binary-expr","locations":[{"start":{"line":71,"column":12},"end":{"line":71,"column":28}},{"start":{"line":71,"column":32},"end":{"line":71,"column":55}}]},"2":{"line":74,"type":"binary-expr","locations":[{"start":{"line":74,"column":9},"end":{"line":74,"column":15}},{"start":{"line":74,"column":19},"end":{"line":74,"column":30}}]}},"code":["(function () { YUI.add('hi-app', function (Y, NAME) {","","\"use strict\";","var CLASS_NAMES = {","\t\tpjax: 'spike-pjax',","\t\tnav: 'spike-nav'","\t},","","\tHiApp,","\t_renderLinks,","\t_renderContent;","","_renderLinks = Y.Handlebars.compile(","\t'<div class=\"pure-menu pure-menu-open pure-menu-horizontal\">' +","\t\t'<ul class=\"' + CLASS_NAMES.nav + '\">' +","\t\t\t'{{#each greetings}}' +","\t\t\t\t'<li><a href=\"#\" data-greeting=\"{{@key}}\">{{short}}</a></li>' +","\t\t\t'{{/each}}' +","\t\t'</ul>' +","\t'</div>');","","_renderContent = Y.Handlebars.compile(","\t'<h2>Hi</h2>' +","\t'<p>' +","\t\t'{{#if name}}Hello {{name}}!{{else}}Hi!{{/if}}' +","\t\t'{{#if greeting}} {{greeting.long}}{{/if}}' +","\t'</p>');","","HiApp = Y.Base.create('hi-app', Y.App, [], {","\tviews: {","\t},","","\tevents: {","\t\t'.spike-nav a': {","\t\t\tclick: '_onNavLinkClick'","\t\t}","\t},","","\tinitializer: function() {","\t\tthis._greetings = {","\t\t\t'welcome': {","\t\t\t\t'short': 'Welcome',","\t\t\t\t'long': 'Welcome to my spike!'","\t\t\t},","\t\t\t'stay': {","\t\t\t\t'short': 'Please Stay',","\t\t\t\t'long': 'Please stay a while, make yourself at home!'","\t\t\t}","\t\t};","\t},","","\trender: function() {","\t\tHiApp.superclass.render.apply(this, arguments);","","\t\tvar links = _renderLinks({","\t\t\tgreetings: this._greetings","\t\t});","","\t\tthis.get('container').insertBefore(links, this.get('viewContainer'));","","\t\treturn this;","\t},","","\t_onNavLinkClick: function(event) {","\t\tevent.preventDefault();","\t\tthis.navigate(this._joinURL(event.target.getData('greeting')));","\t},","","\t_renderInnerAppContent: function() {","\t\tvar componentContext = this.get('componentContext'),","\t\t\tperson = componentContext && componentContext.person;","","\t\tthis.get('viewContainer').setHTML(_renderContent({","\t\t\tname: person && person.name,","\t\t\tgreeting: this._activeGreeting","\t\t}));","\t},","","\t_handleInnerAppRoute: function(req) {","\t\tthis._activeGreeting = this._greetings[req.params.greeting];","\t\tthis._renderInnerAppContent();","\t}","}, {","\tATTRS: {","\t\tcomponentContext: {","\t\t\twriteOnce: 'initOnly'","\t\t},","","\t\troutes: {","\t\t\tvalue: [{","\t\t\t\tpath: '/:greeting',","\t\t\t\tcallbacks: '_handleInnerAppRoute'","\t\t\t}, {","\t\t\t\tpath: '/:greeting/*',","\t\t\t\tcallbacks: '_handleInnerAppRoute'","\t\t\t}]","\t\t},","","\t\tlinkSelector: {","\t\t\tvalue: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'","\t\t}","\t}","});","","Y.namespace('SPIKE').HiApp = HiApp;","","","}, '@VERSION@', {\"requires\": [\"app-base\", \"base\", \"handlebars\"]});","","}());"]};
}
var __cov_K5snV2iLum753wH6$NULiQ = __coverage__['build/hi-app/hi-app.js'];
__cov_K5snV2iLum753wH6$NULiQ.s['1']++;YUI.add('hi-app',function(Y,NAME){'use strict';__cov_K5snV2iLum753wH6$NULiQ.f['1']++;__cov_K5snV2iLum753wH6$NULiQ.s['2']++;var CLASS_NAMES={pjax:'spike-pjax',nav:'spike-nav'},HiApp,_renderLinks,_renderContent;__cov_K5snV2iLum753wH6$NULiQ.s['3']++;_renderLinks=Y.Handlebars.compile('<div class="pure-menu pure-menu-open pure-menu-horizontal">'+'<ul class="'+CLASS_NAMES.nav+'">'+'{{#each greetings}}'+'<li><a href="#" data-greeting="{{@key}}">{{short}}</a></li>'+'{{/each}}'+'</ul>'+'</div>');__cov_K5snV2iLum753wH6$NULiQ.s['4']++;_renderContent=Y.Handlebars.compile('<h2>Hi</h2>'+'<p>'+'{{#if name}}Hello {{name}}!{{else}}Hi!{{/if}}'+'{{#if greeting}} {{greeting.long}}{{/if}}'+'</p>');__cov_K5snV2iLum753wH6$NULiQ.s['5']++;HiApp=Y.Base.create('hi-app',Y.App,[],{views:{},events:{'.spike-nav a':{click:'_onNavLinkClick'}},initializer:function(){__cov_K5snV2iLum753wH6$NULiQ.f['2']++;__cov_K5snV2iLum753wH6$NULiQ.s['6']++;this._greetings={'welcome':{'short':'Welcome','long':'Welcome to my spike!'},'stay':{'short':'Please Stay','long':'Please stay a while, make yourself at home!'}};},render:function(){__cov_K5snV2iLum753wH6$NULiQ.f['3']++;__cov_K5snV2iLum753wH6$NULiQ.s['7']++;HiApp.superclass.render.apply(this,arguments);__cov_K5snV2iLum753wH6$NULiQ.s['8']++;var links=_renderLinks({greetings:this._greetings});__cov_K5snV2iLum753wH6$NULiQ.s['9']++;this.get('container').insertBefore(links,this.get('viewContainer'));__cov_K5snV2iLum753wH6$NULiQ.s['10']++;return this;},_onNavLinkClick:function(event){__cov_K5snV2iLum753wH6$NULiQ.f['4']++;__cov_K5snV2iLum753wH6$NULiQ.s['11']++;event.preventDefault();__cov_K5snV2iLum753wH6$NULiQ.s['12']++;this.navigate(this._joinURL(event.target.getData('greeting')));},_renderInnerAppContent:function(){__cov_K5snV2iLum753wH6$NULiQ.f['5']++;__cov_K5snV2iLum753wH6$NULiQ.s['13']++;var componentContext=this.get('componentContext'),person=(__cov_K5snV2iLum753wH6$NULiQ.b['1'][0]++,componentContext)&&(__cov_K5snV2iLum753wH6$NULiQ.b['1'][1]++,componentContext.person);__cov_K5snV2iLum753wH6$NULiQ.s['14']++;this.get('viewContainer').setHTML(_renderContent({name:(__cov_K5snV2iLum753wH6$NULiQ.b['2'][0]++,person)&&(__cov_K5snV2iLum753wH6$NULiQ.b['2'][1]++,person.name),greeting:this._activeGreeting}));},_handleInnerAppRoute:function(req){__cov_K5snV2iLum753wH6$NULiQ.f['6']++;__cov_K5snV2iLum753wH6$NULiQ.s['15']++;this._activeGreeting=this._greetings[req.params.greeting];__cov_K5snV2iLum753wH6$NULiQ.s['16']++;this._renderInnerAppContent();}},{ATTRS:{componentContext:{writeOnce:'initOnly'},routes:{value:[{path:'/:greeting',callbacks:'_handleInnerAppRoute'},{path:'/:greeting/*',callbacks:'_handleInnerAppRoute'}]},linkSelector:{value:'a.'+CLASS_NAMES.pjax+', .'+CLASS_NAMES.pjax+' a'}}});__cov_K5snV2iLum753wH6$NULiQ.s['17']++;Y.namespace('SPIKE').HiApp=HiApp;},'@VERSION@',{'requires':['app-base','base','handlebars']});
