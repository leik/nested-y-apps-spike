YUI.add("top-app",function(e,t){"use strict";var n={pjax:"spike-pjax"},r=[{contextPath:"hi",moduleName:"hi-app",namespace:"SPIKE",className:"HiApp"},{contextPath:"bye",moduleName:"bye-app",namespace:"SPIKE",className:"ByeApp"}],i=[{identifier:{id:"james",namespace:"human"},name:"James"},{identifier:{id:"spock",namespace:"vulcan"},name:"Spock"}],s='<div class="throbber-large"></div>',o,u,a;u=e.Handlebars.compile('<div class="pure-menu pure-menu-open pure-menu-horizontal"><ul class="'+n.pjax+'">'+"{{#each menuItems}}"+'<li><a href="{{{../baseUrl}}}{{path}}" data-path="{{path}}">{{label}}</a></li>'+"{{/each}}"+'<li class="pure-menu-separator"></li>'+"{{#each people}}"+'<li><a href="{{{../rootUrl}}}{{@key}}" data-personIdentifier="{{@key}}">{{name}}</a></li>'+"{{/each}}"+"</ul>"+"</div>");var a=function(){var t,n=["hash","host","hostname","port","protocol","search"];return function(r,i){var s=r.get("href"),o=r.get("pathname"),u={};if(i===s||i===o||i==="/"+o)return;if(t===!1){r.set("href",i);return}e.each(n,function(e){u[e]=r.get(e)}),r.set("href",i),t||r.get("protocol")!==u.protocol?(t=!0,e.each(u,function(e,t){e&&r.get(t)!==e&&r.set(t,e)})):t=!1}}();o=e.Base.create("top-app",e.App,[],{views:{},initializer:function(){var t,n={},s;t=e.Array.map(r,function(e){return n[e.contextPath]=e,e.moduleName}),e.use(t),this._appConfigByPath=n,this._menuItems=[{label:"Hi",path:"hi"},{label:"Welcome",path:"hi/welcome"},{label:"Bye",path:"bye"},{label:"Good Riddance",path:"bye/riddance"}],s={},e.each(i,function(e){var t=e.identifier;s[t.id+"@"+t.namespace]=e}),this._people=s,this.after("activePersonChange",this._updateAppMenuUrls,this),this.after("activeAppPathChange",this._updatePersonMenuUrls,this)},render:function(){var e;return o.superclass.render.apply(this,arguments),e=u({menuItems:this._menuItems,people:this._people,baseUrl:this.get("baseUrl"),rootUrl:this.get("rootUrl")}),this.get("container").insertBefore(e,this.get("viewContainer")),this._renderWelcomeScreen(),this},_updateAppMenuUrls:function(){var t=this.get("container"),n;if(!t)return;n=this.get("baseUrl"),e.each(this._menuItems,function(e){var r=e.path,i=t.one('> .pure-menu a[data-path="'+r+'"]');i&&a(i,n+r)},this)},_updatePersonMenuUrls:function(){var t=this.get("container"),n,r;if(!t)return;n=this.get("rootUrl"),r=this.get("activeAppPath"),r=r?"/"+r:"",e.each(this._people,function(e,i){var s=t.one('> .pure-menu a[data-personIdentifier="'+i+'"]');s&&a(s,n+i+r)},this)},_handleTopAppRouteChange:function(e){var t=e.params,n=t.appPath,r=t.personId&&t.personNs?t.personId+"@"+t.personNs:null,i=null,s;if(r){i=this._people[r];if(!i){alert('404! No such person with id "'+r+'".');return}}s=i!==this.get("activePerson"),s&&this._set("activePerson",i);if(n){if(!s&&this.get("activeAppPath")===n)return;if(!this._appConfigByPath[n]){alert('404! No registered application with path "'+n+'".');return}}this._activeApp&&(this._activeApp.destroy(),this._set("activeAppPath",null)),n?this._loadAndRenderApp(n):this._renderWelcomeScreen()},_renderWelcomeScreen:function(){this.get("viewContainer").set("text","Welcome to the nested Y.Apps spike!")},_loadAndRenderApp:function(t){this.get("viewContainer").setHTML(s),e.use(this._appConfigByPath[t].moduleName,e.bind(this._renderApp,this,t))},_renderApp:function(t){var n=this._appConfigByPath[t],r=e.namespace(n.namespace),i=r&&r[n.className],s,o,u,a;if(!i){alert('500! Failed to load application with path "'+t+'".');return}s=this.get("viewContainer"),s.empty(),o={container:s,root:this.get("baseUrl")+t,linkSelector:null,serverRouting:!0},this.get("html5")||(o.root=this.removeRoot(o.root)),u=this.get("activePerson"),u&&(o.componentContext={person:u}),a=new i(o),this._activeApp=a,this._set("activeAppPath",t),a.render().dispatch()},_getAttrRootUrl:function(){return this._normalizePath(this.get("root")+"/")},_getAttrBaseUrl:function(){var e=this.get("rootUrl"),t=this.get("activePerson"),n;return t&&(n=t.identifier,e+=n.id+"@"+n.namespace+"/"),this._normalizePath(e)}},{ATTRS:{activePerson:{readOnly:!0},activeAppPath:{readOnly:!0},rootUrl:{readOnly:!0,getter:"_getAttrRootUrl"},baseUrl:{readOnly:!0,getter:"_getAttrBaseUrl"},routes:{value:[{path:"/:personId@:personNs",callbacks:"_handleTopAppRouteChange"},{path:"/:personId@:personNs/:appPath",callbacks:"_handleTopAppRouteChange"},{path:"/:personId@:personNs/:appPath/*",callbacks:"_handleTopAppRouteChange"},{path:"/:appPath",callbacks:"_handleTopAppRouteChange"},{path:"/:appPath/*",callbacks:"_handleTopAppRouteChange"}]},linkSelector:{value:"a."+n.pjax+", ."+n.pjax+" a"}}}),e.namespace("SPIKE").TopApp=o},"@VERSION@",{requires:["app-base","array-extras","base","handlebars"]});
