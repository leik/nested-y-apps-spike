if (typeof __coverage__ === 'undefined') { __coverage__ = {}; }
if (!__coverage__['build/bye-app/bye-app.js']) {
   __coverage__['build/bye-app/bye-app.js'] = {"path":"build/bye-app/bye-app.js","s":{"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":0,"11":0,"12":0,"13":0,"14":0,"15":0},"b":{"1":[0,0],"2":[0,0]},"f":{"1":0,"2":0,"3":0,"4":0,"5":0},"fnMap":{"1":{"name":"(anonymous_1)","line":1,"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":38}}},"2":{"name":"(anonymous_2)","line":32,"loc":{"start":{"line":32,"column":14},"end":{"line":32,"column":25}}},"3":{"name":"(anonymous_3)","line":45,"loc":{"start":{"line":45,"column":9},"end":{"line":45,"column":20}}},"4":{"name":"(anonymous_4)","line":58,"loc":{"start":{"line":58,"column":25},"end":{"line":58,"column":36}}},"5":{"name":"(anonymous_5)","line":68,"loc":{"start":{"line":68,"column":23},"end":{"line":68,"column":37}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":100,"column":66}},"2":{"start":{"line":4,"column":0},"end":{"line":10,"column":16}},"3":{"start":{"line":12,"column":0},"end":{"line":19,"column":11}},"4":{"start":{"line":21,"column":0},"end":{"line":26,"column":9}},"5":{"start":{"line":28,"column":0},"end":{"line":95,"column":3}},"6":{"start":{"line":33,"column":2},"end":{"line":42,"column":4}},"7":{"start":{"line":46,"column":2},"end":{"line":46,"column":50}},"8":{"start":{"line":48,"column":2},"end":{"line":51,"column":5}},"9":{"start":{"line":53,"column":2},"end":{"line":53,"column":71}},"10":{"start":{"line":55,"column":2},"end":{"line":55,"column":14}},"11":{"start":{"line":59,"column":2},"end":{"line":60,"column":56}},"12":{"start":{"line":62,"column":2},"end":{"line":65,"column":6}},"13":{"start":{"line":69,"column":2},"end":{"line":69,"column":62}},"14":{"start":{"line":70,"column":2},"end":{"line":70,"column":32}},"15":{"start":{"line":97,"column":0},"end":{"line":97,"column":37}}},"branchMap":{"1":{"line":60,"type":"binary-expr","locations":[{"start":{"line":60,"column":12},"end":{"line":60,"column":28}},{"start":{"line":60,"column":32},"end":{"line":60,"column":55}}]},"2":{"line":63,"type":"binary-expr","locations":[{"start":{"line":63,"column":9},"end":{"line":63,"column":15}},{"start":{"line":63,"column":19},"end":{"line":63,"column":30}}]}},"code":["(function () { YUI.add('bye-app', function (Y, NAME) {","","\"use strict\";","var CLASS_NAMES = {","\t\tpjax: 'spike-pjax'","\t},","","\tByeApp,","\t_renderLinks,","\t_renderContent;","","_renderLinks = Y.Handlebars.compile(","\t'<div class=\"pure-menu pure-menu-open pure-menu-horizontal\">' +","\t\t'<ul class=\"' + CLASS_NAMES.pjax + '\">' +","\t\t\t'{{#each farewells}}' +","\t\t\t\t'<li><a href=\"{{{../baseUrl}}}{{@key}}\">{{short}}</a></li>' +","\t\t\t'{{/each}}' +","\t\t'</ul>' +","\t'</div>');","","_renderContent = Y.Handlebars.compile(","\t'<h2>Bye</h2>' +","\t'<p>' +","\t\t'Goodbye{{#if name}} {{name}}{{/if}}' +","\t\t'{{#if farewell}}, {{farewell.long}}{{else}}.{{/if}}' +","\t'</p>');","","ByeApp = Y.Base.create('bye-app', Y.App, [], {","\tviews: {","\t},","","\tinitializer: function() {","\t\tthis._farewells = {","\t\t\t'seeya': {","\t\t\t\t'short': 'See Ya',","\t\t\t\t'long': 'see you next time.'","\t\t\t},","\t\t\t'riddance': {","\t\t\t\t'short': 'Good Riddance',","\t\t\t\t'long': 'and good riddance!'","\t\t\t}","\t\t};","\t},","","\trender: function() {","\t\tByeApp.superclass.render.apply(this, arguments);","","\t\tvar links = _renderLinks({","\t\t\tbaseUrl: this._normalizePath(this.get('root') + '/'),","\t\t\tfarewells: this._farewells","\t\t});","","\t\tthis.get('container').insertBefore(links, this.get('viewContainer'));","","\t\treturn this;","\t},","","\t_renderInnerAppContent: function() {","\t\tvar componentContext = this.get('componentContext'),","\t\t\tperson = componentContext && componentContext.person;","","\t\tthis.get('viewContainer').setHTML(_renderContent({","\t\t\tname: person && person.name,","\t\t\tfarewell: this._activeFarewell","\t\t}));","\t},","","\t_handleInnerAppRoute: function(req) {","\t\tthis._activeFarewell = this._farewells[req.params.farewell];","\t\tthis._renderInnerAppContent();","\t}","}, {","\tATTRS: {","\t\tcomponentContext: {","\t\t\twriteOnce: 'initOnly'","\t\t},","","\t\troutes: {","\t\t\tvalue: [{","\t\t\t\tpath: '/',","\t\t\t\tcallbacks: '_handleInnerAppRoute'","\t\t\t}, {","\t\t\t\tpath: '/:farewell',","\t\t\t\tcallbacks: '_handleInnerAppRoute'","\t\t\t}, {","\t\t\t\tpath: '/:farewell/*',","\t\t\t\tcallbacks: '_handleInnerAppRoute'","\t\t\t}]","\t\t},","","\t\tlinkSelector: {","\t\t\tvalue: 'a.' + CLASS_NAMES.pjax +', .' + CLASS_NAMES.pjax + ' a'","\t\t}","\t}","});","","Y.namespace('SPIKE').ByeApp = ByeApp;","","","}, '@VERSION@', {\"requires\": [\"app-base\", \"base\", \"handlebars\"]});","","}());"]};
}
var __cov_Hb3ZYGdNEx2IHhHMMgmBLg = __coverage__['build/bye-app/bye-app.js'];
__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['1']++;YUI.add('bye-app',function(Y,NAME){'use strict';__cov_Hb3ZYGdNEx2IHhHMMgmBLg.f['1']++;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['2']++;var CLASS_NAMES={pjax:'spike-pjax'},ByeApp,_renderLinks,_renderContent;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['3']++;_renderLinks=Y.Handlebars.compile('<div class="pure-menu pure-menu-open pure-menu-horizontal">'+'<ul class="'+CLASS_NAMES.pjax+'">'+'{{#each farewells}}'+'<li><a href="{{{../baseUrl}}}{{@key}}">{{short}}</a></li>'+'{{/each}}'+'</ul>'+'</div>');__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['4']++;_renderContent=Y.Handlebars.compile('<h2>Bye</h2>'+'<p>'+'Goodbye{{#if name}} {{name}}{{/if}}'+'{{#if farewell}}, {{farewell.long}}{{else}}.{{/if}}'+'</p>');__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['5']++;ByeApp=Y.Base.create('bye-app',Y.App,[],{views:{},initializer:function(){__cov_Hb3ZYGdNEx2IHhHMMgmBLg.f['2']++;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['6']++;this._farewells={'seeya':{'short':'See Ya','long':'see you next time.'},'riddance':{'short':'Good Riddance','long':'and good riddance!'}};},render:function(){__cov_Hb3ZYGdNEx2IHhHMMgmBLg.f['3']++;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['7']++;ByeApp.superclass.render.apply(this,arguments);__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['8']++;var links=_renderLinks({baseUrl:this._normalizePath(this.get('root')+'/'),farewells:this._farewells});__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['9']++;this.get('container').insertBefore(links,this.get('viewContainer'));__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['10']++;return this;},_renderInnerAppContent:function(){__cov_Hb3ZYGdNEx2IHhHMMgmBLg.f['4']++;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['11']++;var componentContext=this.get('componentContext'),person=(__cov_Hb3ZYGdNEx2IHhHMMgmBLg.b['1'][0]++,componentContext)&&(__cov_Hb3ZYGdNEx2IHhHMMgmBLg.b['1'][1]++,componentContext.person);__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['12']++;this.get('viewContainer').setHTML(_renderContent({name:(__cov_Hb3ZYGdNEx2IHhHMMgmBLg.b['2'][0]++,person)&&(__cov_Hb3ZYGdNEx2IHhHMMgmBLg.b['2'][1]++,person.name),farewell:this._activeFarewell}));},_handleInnerAppRoute:function(req){__cov_Hb3ZYGdNEx2IHhHMMgmBLg.f['5']++;__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['13']++;this._activeFarewell=this._farewells[req.params.farewell];__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['14']++;this._renderInnerAppContent();}},{ATTRS:{componentContext:{writeOnce:'initOnly'},routes:{value:[{path:'/',callbacks:'_handleInnerAppRoute'},{path:'/:farewell',callbacks:'_handleInnerAppRoute'},{path:'/:farewell/*',callbacks:'_handleInnerAppRoute'}]},linkSelector:{value:'a.'+CLASS_NAMES.pjax+', .'+CLASS_NAMES.pjax+' a'}}});__cov_Hb3ZYGdNEx2IHhHMMgmBLg.s['15']++;Y.namespace('SPIKE').ByeApp=ByeApp;},'@VERSION@',{'requires':['app-base','base','handlebars']});