/*! For license information please see main-bundle.js.LICENSE.txt */
(()=>{"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}var t=function t(n,o){function c(t,c,r){if("undefined"!=typeof document){"number"==typeof(r=e({},o,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var a="";for(var i in r)r[i]&&(a+="; "+i,!0!==r[i]&&(a+="="+r[i].split(";")[0]));return document.cookie=t+"="+n.write(c,t)+a}}return Object.create({set:c,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},c=0;c<t.length;c++){var r=t[c].split("="),a=r.slice(1).join("=");try{var i=decodeURIComponent(r[0]);if(o[i]=n.read(a,i),e===i)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){c(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});let n;const o={1:{eventCategory:"free_trial_link",eventAction:"click",eventLabel:'"Start free trial" link clicked'},2:{eventCategory:"buy_link",eventAction:"click",eventLabel:'"Buy" link clicked'},3:{eventCategory:"contact_form",eventAction:"submitted",eventLabel:'"Contact Form" submitted'},4:{eventCategory:"subscribe_newsletter_link",eventAction:"click",eventLabel:'"Subscribe Newsletter" link clicked'},5:{eventCategory:"page_time",eventAction:"more_than_2_mins",eventLabel:"User stayed more than 2 mins"},6:{eventCategory:"scroll_50",eventAction:"scrolled",eventLabel:"User scrolled more than 50%"},7:{eventCategory:"scroll_80",eventAction:"scrolled",eventLabel:"User scrolled more than 80%"},8:{eventCategory:"mail_link",eventAction:"click",eventLabel:'"Mailto:" link clicked'},9:{eventCategory:"click",eventAction:"login",eventLabel:'"Login" link clicked'}};function c(){t.set("sessionstart",new Date(Date.now()).toISOString(),{expires:1}),r(0)}function r(e){setTimeout((function(){i(5)}),1e3*(120-e))}function a(e=.5){let t=!0;document.addEventListener("scroll",function(e,t=300){let n;return(...o)=>{clearTimeout(n),n=setTimeout((()=>{e.apply(this,o)}),t)}}((()=>{document.documentElement.scrollHeight*e<window.scrollY+window.innerHeight&&t&&(.5===e&&(t=!1,i(6,window.location.href)),.8===e&&(t=!1,i(7,window.location.href)))}),1e3))}function i(e,t=null){n("event",o[e].eventAction,{event_category:o[e].eventCategory,event_label:t||o[e].eventLabel})}function l(e,t,n){const o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);const c="expires="+o.toUTCString();document.cookie=e+"="+t+";"+c+";path=/"}function s(e){return function(e){const t=e+"=",n=document.cookie.split(";");for(var o=0;o<n.length;o++){for(var c=n[o];" "===c.charAt(0);)c=c.substring(1);if(0===c.indexOf(t))return c.substring(t.length,c.length)}return""}(e)}function d(){document.querySelectorAll(".information").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-less").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-more").forEach((e=>{e.classList.toggle("active")}))}const u="acknowledged-cookies2";function m(){s(u)||(document.getElementById("cookie-info").classList.add("show"),document.getElementById("acknowledge-cookies-btn").addEventListener("click",(function(){l(u,"true",7300),document.getElementById("cookie-info").classList.remove("show"),g()})),document.getElementById("refuse-cookies-btn").addEventListener("click",(function(){l(u,"false",7300),document.getElementById("cookie-info").classList.remove("show")})),document.querySelectorAll(".show-more").forEach((e=>{e.addEventListener("click",(function(){d()}))})),document.querySelectorAll(".show-less").forEach((e=>{e.addEventListener("click",(function(){d()}))})))}function g(){var e,o,s,d;!function(){const e=window.location.search,t=new URLSearchParams(e);t.get("adgroupid")&&l("adgroupid",t.get("adgroupid"),365)}(),function(){let e=document.createElement("script");function o(){dataLayer.push(arguments)}e.setAttribute("src","https://www.googletagmanager.com/gtag/js?id=G-CX618DRF59"),document.getElementsByTagName("head")[0].appendChild(e),window.dataLayer=window.dataLayer||[],o("consent","default",{ad_user_data:"granted",ad_personalization:"granted",ad_storage:"granted",analytics_storage:"granted"}),o("js",new Date),o("config","G-CX618DRF59",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),o("config","UA-119338300-1",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),o("config","AW-744401159",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),n=o,document.querySelectorAll(".btn.trial").forEach((e=>{e.addEventListener("click",(e=>{i(1)}))})),document.querySelectorAll(".btn.btn-primary.footer.buy").forEach((e=>{e.addEventListener("click",(e=>{i(2)}))})),document.querySelectorAll("#helpdesk_ticket_submit").forEach((e=>{e.addEventListener("click",(e=>{i(3)}))})),document.querySelectorAll(".btn.newsletter").forEach((e=>{e.addEventListener("click",(e=>{i(4)}))})),function(){if(t.get("sessionstart")){var e=new Date(Date.parse(t.get("sessionstart")));if(e){var n=(Date.now()-e.getTime())/1e3;n>43200?c():n<=120&&r(n)}else c()}else c()}(),a(.5),a(.8),document.querySelectorAll('a[href*="mailto"]').forEach((e=>{e.addEventListener("click",(t=>{e.href.split(":")[1].includes("@")&&i(8,e.href.split(":")[1])}))})),document.querySelectorAll("a").forEach((e=>{if(e.href.includes("/Web/Home/Login")){const t=e.href;e.href="#",e.addEventListener("click",(async e=>{i(9),await new Promise((e=>setTimeout((function(){window.location.href=t}),50)))}))}}))}(),window.ldfdr=window.ldfdr||{},e=document,o="script",s=e.getElementsByTagName(o)[0],(d=e.createElement(o)).src="https://sc.lfeeder.com/lftracker_v1_3P1w24dnWAB8mY5n.js",setTimeout((function(){s.parentNode.insertBefore(d,s)}),1)}function h(e,t,n){function o(t){return t<0?e.children.length+t:t>=e.children.length?t-e.children.length:t}let c=e.querySelector("li.active"),r=Array.from(e.children).indexOf(c),a=e.children[o(r-1)],i=Array.from({length:n-1},((t,n)=>e.children[o(r+1+n)])),l=e.children[o(r+n)];a.classList.remove("out-left"),t&&a.classList.add("active"),a.style.order=t?1:"initial",c.classList.remove("active"),c.classList.add(t?"show":"out-left"),c.style.order=t?2:0,i.forEach(((e,o)=>{0!=o||t||(e.classList.remove("show"),e.classList.add("active")),o==n-2&&t&&(e.classList.remove("show"),e.classList.add("out-right")),e.style.order=t?3+o:1+o})),l.classList.remove("out-right"),t||l.classList.add(1==n?"active":"show"),l.style.order=t?"initial":n,t?(e.children[o(r-2)].classList.add("out-left"),e.children[o(r-2)].style.order=0):(e.children[o(r+n+1)].classList.add("out-right"),e.children[o(r+n+1)].style.order=n+1)}document.addEventListener("DOMContentLoaded",(function(){s(u)?g():function(){const e=new XMLHttpRequest;e.onreadystatechange=()=>{4==e.readyState&&(200==e.status?"EU"===JSON.parse(e.responseText).continentCode?m():g():(console.error("query failed"),m()))},e.open("GET","https://pro.ip-api.com/json?fields=status,continentCode&key=eJ1eA5qDeyPkvao",!0),e.send()}(),document.querySelectorAll(".revoke-cookie-consent").forEach((e=>{e.addEventListener("click",(function(){document.cookie.split(";").forEach((function(e){document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires="+(new Date).toUTCString()+";path=/")})),m()}))})),function(){var e=document.getElementById("show-older-releases-link");e&&e.addEventListener("click",(function(e){document.getElementById("older-releases").style.display="block",document.getElementById("show-older-releases").style.display="none",e.preventDefault(),e.stopPropagation()}));var t=document.getElementById("changelog-component-select");t&&t.addEventListener("change",(function(e){const n=new URL(location);"all"==t.value?n.searchParams.delete("component"):n.searchParams.set("component",t.value),history.pushState({},"",n),c(t.value)}));var n=document.getElementById("changelog-change_type-select");n&&n.addEventListener("change",(function(e){const t=new URL(location);var o;"all"==n.value?t.searchParams.delete("change_type"):t.searchParams.set("change_type",n.value),history.pushState({},"",t),o=n.value,document.querySelectorAll("section.changelog div[class^=change_type-], section.changelog article.release, section.changelog article.release div.component").forEach((function(e){"all"==o||e.classList.contains(`change_type-${o}`)?e.style.display="block":e.style.display="none"}))}));const o=new URL(location);if(o.searchParams.has("component")){let e=o.searchParams.get("component");c(e),document.getElementById("changelog-component-select").value=e;let t=o.searchParams.get("change_type");show_hide_change_type(t),document.getElementById("changelog-change_type-select").value=t}function c(e){document.querySelectorAll("section.changelog div[class^=component-], section.changelog article.release").forEach((function(t){"all"==e||t.classList.contains(`component-${e}`)?t.style.display="block":t.style.display="none"})),document.getElementById("changelog-feed").href=`/documentation/changelog/feeds/${e}.xml`}}(),document.querySelectorAll("div.carousel").forEach((e=>{let t,n=function(){let e=document.body.clientWidth;return e>1e3?3:e>700?2:1}();function o(){t&&(clearInterval(t),t=void 0),t=setInterval((function(){h(e.querySelector("ul"),!1,n)}),3e3)}!function(e,t,n){e.querySelectorAll("li").forEach(((e,n)=>{0==n?e.classList.add("out-left"):1==n?e.classList.add("active"):n==t+1?e.classList.add("out-right"):n<=t&&e.classList.add("show")})),e.querySelectorAll("a").forEach(((e,o)=>{0==o?e.addEventListener("click",(function(e){h(e.currentTarget.parentNode.querySelector("ul"),!0,t),n(),e.preventDefault()})):e.addEventListener("click",(function(e){h(e.currentTarget.parentNode.querySelector("ul"),!1,t),n(),e.preventDefault()}))}))}(e,n,o),o()}))}))})();