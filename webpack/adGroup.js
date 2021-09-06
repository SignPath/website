import {cookieConsentCookieName, isCookieConsent, setCookie} from "./cookie.js";

export function setGoogleAdGroup() {

    if(isCookieConsent(cookieConsentCookieName)){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if(urlParams.get('adgroupid')){
            setCookie('adgroupid', urlParams.get('adgroupid'), 365)
        }
    }

}