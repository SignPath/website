(()=>{"use strict";const e=function(){if(i(s)&&a(s)){let e=document.createElement("script");function t(){dataLayer.push(arguments)}e.setAttribute("src","https://www.googletagmanager.com/gtag/js?id=UA-119338300-1"),document.getElementsByTagName("head")[0].appendChild(e),window.dataLayer=window.dataLayer||[],t("consent","default",{ad_storage:"granted",analytics_storage:"granted"}),t("js",new Date),t("config","UA-119338300-1",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]}),t("config","AW-744401159",{anonymize_ip:!0,domains:["app.signpath.io","secure.avangate.com"]})}},t=function(){var e,t,n,o;i(s)&&a(s)&&(window.ldfdr=window.ldfdr||{},e=document,t="script",n=e.getElementsByTagName(t)[0],"https://sc.lfeeder.com/lftracker_v1_3P1w24dnWAB8mY5n.js",(o=e.createElement(t)).src="https://sc.lfeeder.com/lftracker_v1_3P1w24dnWAB8mY5n.js",setTimeout((function(){n.parentNode.insertBefore(o,n)}),1))};function n(){if(a(s)){const e=window.location.search,t=new URLSearchParams(e);t.get("adgroupid")&&o("adgroupid",t.get("adgroupid"),365)}}function o(e,t,n){const o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3);const c="expires="+o.toUTCString();document.cookie=e+"="+t+";"+c+";path=/"}function c(e){const t=e+"=",n=document.cookie.split(";");for(var o=0;o<n.length;o++){for(var c=n[o];" "===c.charAt(0);)c=c.substring(1);if(0===c.indexOf(t))return c.substring(t.length,c.length)}return""}function i(e){return c(e)}function a(e){return"true"===c(e)}function r(){document.querySelectorAll(".information").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-less").forEach((e=>{e.classList.toggle("active")})),document.querySelectorAll(".show-more").forEach((e=>{e.classList.toggle("active")}))}const s="acknowledged-cookies";function d(){i(s)?document.querySelectorAll(".revoke-cookie-consent").forEach((e=>{e.addEventListener("click",(function(){document.cookie.split(";").forEach((function(e){document.cookie=e.replace(/^ +/,"").replace(/=.*/,"=;expires="+(new Date).toUTCString()+";path=/")})),d()}))})):(document.getElementById("cookie-info").classList.add("show"),document.getElementById("acknowledge-cookies-btn").addEventListener("click",(function(){o(s,"true",7300),document.getElementById("cookie-info").classList.remove("show"),n(),e(),t()})),document.getElementById("refuse-cookies-btn").addEventListener("click",(function(){o(s,"false",7300),document.getElementById("cookie-info").classList.remove("show")})),document.querySelectorAll(".show-more").forEach((e=>{e.addEventListener("click",(function(){r()}))})),document.querySelectorAll(".show-less").forEach((e=>{e.addEventListener("click",(function(){r()}))})))}document.addEventListener("DOMContentLoaded",(function(){n(),d(),e(),t()}))})();