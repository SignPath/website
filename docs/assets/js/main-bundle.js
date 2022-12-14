/*! For license information please see main-bundle.js.LICENSE.txt */
(()=>{"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}const t=function t(n,o){function c(t,c,r){if("undefined"!=typeof document){"number"==typeof(r=e({},o,r)).expires&&(r.expires=new Date(Date.now()+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var i="";for(var a in r)r[a]&&(i+="; "+a,!0!==r[a]&&(i+="="+r[a].split(";")[0]));return document.cookie=t+"="+n.write(c,t)+i}}return Object.create({set:c,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},c=0;c<t.length;c++){var r=t[c].split("="),i=r.slice(1).join("=");try{var a=decodeURIComponent(r[0]);if(o[a]=n.read(i,a),e===a)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){c(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"});let n;const o={1:{eventCategory:"free_trial_link",eventAction:"click",eventLabel:'"Start free trial" link clicked'},2:{eventCategory:"buy_link",eventAction:"click",eventLabel:'"Buy" link clicked'},3:{eventCategory:"contact_form",eventAction:"submitted",eventLabel:'"Contact Form" submitted'},4:{eventCategory:"subscribe_newsletter_link",eventAction:"click",eventLabel:'"Subscribe Newsletter" link clicked'},5:{eventCategory:"page_visits",eventAction:"visit",eventLabel:"User visited more than one page"},6:{eventCategory:"scroll_50",eventAction:"scrolled",eventLabel:"User scrolled more than 50%"},7:{eventCategory:"scroll_80",eventAction:"scrolled",eventLabel:"User scrolled more than 80%"},8:{eventCategory:"mail_link",eventAction:"click",eventLabel:'"Mailto:" link clicked'},9:{eventCategory:"click",eventAction:"login",eventLabel:'"Login" link clicked'}};function c(e=.5){let t=!0;document.addEventListener("scroll",function(e,t=300){let n;return(...o)=>{clearTimeout(n),n=setTimeout((()=>{e.apply(this,o)}),t)}}((()=>{document.documentElement.scrollHeight*e<window.scrollY+window.innerHeight&&t&&(.5===e&&(t=!1,r(6,window.location.href)),.8===e&&(t=!1,r(7,window.location.href)))}),1e3))}function r(e,t=null){n("event",o[e].eventAction,{event_category:o[e].eventCategory,event_label:t||o[e].eventLabel})}function i(e,t,n){const o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);const c="expires="+o.toUTCString();document.cookie=e+"="+t+";"+c+";path=/"}function a(e){const t=e+"=",n=document.cookie.split(";");for(var o=0;o<n.length;o++){for(var c=n[o];" "===c.charAt(0);)c=c.substring(1);if(0===c.indexOf(t))return c.substring(t.length,c.length)}return""}function l(e){return a(e)}function s(){document.querySelectorAll(".information").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-less").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-more").forEach((e=>{e.classList.toggle("active")}))}const d="acknowledged-cookies2";function u(){l(d)||(document.getElementById("cookie-info").classList.add("show"),document.getElementById("acknowledge-cookies-btn").addEventListener("click",(function(){i(d,"true",7300),document.getElementById("cookie-info").classList.remove("show"),f()})),document.getElementById("refuse-cookies-btn").addEventListener("click",(function(){i(d,"false",7300),document.getElementById("cookie-info").classList.remove("show")})),document.querySelectorAll(".show-more").forEach((e=>{e.addEventListener("click",(function(){s()}))})),document.querySelectorAll(".show-less").forEach((e=>{e.addEventListener("click",(function(){s()}))})))}function f(){var e,o,s,u;!function(){const e=window.location.search,t=new URLSearchParams(e);t.get("adgroupid")&&i("adgroupid",t.get("adgroupid"),365)}(),function(){let e=document.createElement("script");function o(){dataLayer.push(arguments)}e.setAttribute("src","https://www.googletagmanager.com/gtag/js?id=UA-119338300-1"),document.getElementsByTagName("head")[0].appendChild(e),window.dataLayer=window.dataLayer||[],o("consent","default",{ad_storage:"granted",analytics_storage:"granted"}),o("js",new Date),o("config","UA-119338300-1",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),o("config","AW-744401159",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),n=o,document.querySelectorAll(".btn.trial").forEach((e=>{e.addEventListener("click",(e=>{r(1)}))})),document.querySelectorAll(".btn.btn-primary.footer.buy").forEach((e=>{e.addEventListener("click",(e=>{r(2)}))})),document.querySelectorAll("#helpdesk_ticket_submit").forEach((e=>{e.addEventListener("click",(e=>{r(3)}))})),document.querySelectorAll(".btn.newsletter").forEach((e=>{e.addEventListener("click",(e=>{r(4)}))})),l(d)&&"true"===a(d)&&(t.get("vc")&&"0"===t.get("vc")?t.set("vc",1,{expires:7}):t.get("vc")&&"1"===t.get("vc")?(r(5),t.set("vc",2,{expires:7})):"2"!==t.get("vc")&&t.set("vc",0,{expires:7})),c(.5),c(.8),document.querySelectorAll('a[href*="mailto"]').forEach((e=>{e.addEventListener("click",(t=>{e.href.split(":")[1].includes("@")&&r(8,e.href.split(":")[1])}))})),document.querySelectorAll("a").forEach((e=>{if(e.href.includes("/Web/Home/Login")){const t=e.href;e.href="#",e.addEventListener("click",(async e=>{r(9),await new Promise((e=>setTimeout((function(){window.location.href=t}),500)))}))}}))}(),window.ldfdr=window.ldfdr||{},e=document,o="script",s=e.getElementsByTagName(o)[0],(u=e.createElement(o)).src="https://sc.lfeeder.com/lftracker_v1_3P1w24dnWAB8mY5n.js",setTimeout((function(){s.parentNode.insertBefore(u,s)}),1)}document.addEventListener("DOMContentLoaded",(function(){l(d)?f():function(){const e=new XMLHttpRequest;e.onreadystatechange=()=>{4==e.readyState&&(200==e.status?"EU"===JSON.parse(e.responseText).continentCode?u():f():(console.error("query failed"),u()))},e.open("GET","https://pro.ip-api.com/json?fields=status,continentCode&key=eJ1eA5qDeyPkvao",!0),e.send()}(),document.querySelectorAll(".revoke-cookie-consent").forEach((e=>{e.addEventListener("click",(function(){document.cookie.split(";").forEach((function(e){document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires="+(new Date).toUTCString()+";path=/")})),u()}))}))}))})();