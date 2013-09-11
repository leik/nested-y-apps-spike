YUI.add("hi-app",function(e,t){"use strict";var n={pjax:"spike-pjax"},r,i,s;i=e.Handlebars.compile('<div class="pure-menu pure-menu-open pure-menu-horizontal"><ul class="'+n.pjax+'">'+"{{#each greetings}}"+'<li><a href="{{{../baseUrl}}}{{@key}}">{{short}}</a></li>'+"{{/each}}"+"</ul>"+"</div>"),s=e.Handlebars.compile("<h2>Hi</h2><p>{{#if name}}Hello {{name}}!{{else}}Hi!{{/if}}{{#if greeting}} {{greeting.long}}{{/if}}</p>"),r=e.Base.create("hi-app",e.App,[],{views:{},initializer:function(){this._greetings={welcome:{"short":"Welcome","long":"Welcome to my spike!"},stay:{"short":"Please Stay","long":"Please stay a while, make yourself at home!"}}},render:function(){r.superclass.render.apply(this,arguments);var e=i({baseUrl:this._normalizePath(this.get("root")+"/"),greetings:this._greetings});return this.get("container").insertBefore(e,this.get("viewContainer")),this},_renderInnerAppContent:function(){var e=this.get("componentContext"),t=e&&e.person;this.get("viewContainer").setHTML(s({name:t&&t.name,greeting:this._activeGreeting}))},_handleInnerAppRoute:function(e){this._activeGreeting=this._greetings[e.params.greeting],this._renderInnerAppContent()}},{ATTRS:{componentContext:{writeOnce:"initOnly"},routes:{value:[{path:"/",callbacks:"_handleInnerAppRoute"},{path:"/:greeting",callbacks:"_handleInnerAppRoute"},{path:"/:greeting/*",callbacks:"_handleInnerAppRoute"}]},linkSelector:{value:"a."+n.pjax+", ."+n.pjax+" a"}}}),e.namespace("SPIKE").HiApp=r},"@VERSION@",{requires:["app-base","base","handlebars"]});
