// set cookie acknowledgement
// functions taken from https://www.w3schools.com/js/js_cookies.asp
import analytics from "./analytics.js";
import leadfeeder from "./leadfeeder.js";
import {setGoogleAdGroup} from "./adGroup";

export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function revokeCookie(cookieName) {
    setCookie(cookieName, null, 365 * -100);
}

export function isCookieSet(cookieName) {
    return getCookie(cookieName);
}

export function isCookieConsent(cookieName) {
    return getCookie(cookieName) === 'true';
}

function toggleMobile() {
    document.querySelectorAll('.information').forEach(info => {
        info.classList.toggle('active')
    })
    document.querySelectorAll('.show-less').forEach(showless => {
        showless.classList.toggle('active')
    })
    document.querySelectorAll('.show-more').forEach(showmore => {
        showmore.classList.toggle('active')
    })
}

export const cookieConsentCookieName = 'acknowledged-cookies';

export function cookieBanner() {
    if (!isCookieSet(cookieConsentCookieName)) {
        isUserFromEu()
    } else {
        loadResources()
    }
    addRevokeHandler()
}

function isUserFromEu() {
    // WIP: HTTPS & API KEY MISSING
    const endpoint = 'https://pro.ip-api.com/json?fields=status,continentCode&key=eJ1eA5qDeyPkvao';
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if(xhr.status == 200){
                var response = JSON.parse(xhr.responseText);
                if (response.continentCode === 'EU') {
                showCookieBanner()
            } else {
                loadResources()
            }
            }else{
                console.error('query failed');
                showCookieBanner()
            }
        }
    };
    xhr.open('GET', endpoint, true);
    xhr.send();
}

function showCookieBanner() {
    if (!isCookieSet(cookieConsentCookieName)) {
        document.getElementById('cookie-info').classList.add('show');
        document.getElementById('acknowledge-cookies-btn').addEventListener('click', function () {
            setCookie(cookieConsentCookieName, 'true', 365 * 20); // expires in 20 years
            document.getElementById('cookie-info').classList.remove('show');
            loadResources()
        })
        document.getElementById('refuse-cookies-btn').addEventListener('click', function () {
            setCookie(cookieConsentCookieName, 'false', 365 * 20); // expires in 20 years
            document.getElementById('cookie-info').classList.remove('show');
        })
        document.querySelectorAll('.show-more').forEach(btn => {
            btn.addEventListener('click', function () {
                toggleMobile()
            })
        });
        document.querySelectorAll('.show-less').forEach(btn => {
            btn.addEventListener('click', function () {
                toggleMobile()
            })
        });
    }
}


function addRevokeHandler() {
    document.querySelectorAll('.revoke-cookie-consent').forEach(c => {
        c.addEventListener('click', function () {
            document.cookie.split(";").forEach(function (c) {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            showCookieBanner()
        })
    });
}

function loadResources() {
    setGoogleAdGroup()
    analytics()
    leadfeeder()
}
