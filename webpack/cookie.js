// set cookie acknowledgement
// functions taken from https://www.w3schools.com/js/js_cookies.asp
import analytics from "./analytics.js";
import leadfeeder from "./leadfeeder.js";

function setCookie(cname, cvalue, exdays) {
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

export const cookieConsentCookieName = 'acknowledged-cookies';

export function showCookieBanner() {
    if (!isCookieSet(cookieConsentCookieName)) {
        document.getElementById('cookie-info').classList.add('show');
        document.getElementById('acknowledge-cookies-btn').addEventListener('click', function () {
            setCookie(cookieConsentCookieName, 'true', 365 * 20); // expires in 20 years
            document.getElementById('cookie-info').classList.remove('show');
            analytics()
            leadfeeder()
        })
        document.getElementById('refuse-cookies-btn').addEventListener('click', function () {
            setCookie(cookieConsentCookieName, 'false', 365 * 20); // expires in 20 years
            document.getElementById('cookie-info').classList.remove('show');
        })
    } else {
        document.querySelectorAll('.revoke-cookie-consent').forEach(c => {
            c.addEventListener('click', function () {
                document.cookie.split(";").forEach(function (c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                showCookieBanner()
            })
        });
    }
}
