import {cookieConsentCookieName, isCookieConsent, isCookieSet} from "./cookie.js";

export function Leadfeeder() {
    if (isCookieSet(cookieConsentCookieName) && isCookieConsent(cookieConsentCookieName)) {
        (function () {
            window.ldfdr = window.ldfdr || {};
            (function (d, s, ss, fs) {
                fs = d.getElementsByTagName(s)[0];

                function ce(src) {
                    var cs = d.createElement(s);
                    cs.src = src;
                    setTimeout(function () {
                        fs.parentNode.insertBefore(cs, fs)
                    }, 1);
                }

                ce(ss);
            })(document, 'script', 'https://sc.lfeeder.com/lftracker_v1_3P1w24dnWAB8mY5n.js');
        })()
    }
}

export default Leadfeeder;
