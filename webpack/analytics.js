import {cookieConsentCookieName, isCookieConsent, isCookieSet} from "./cookie.js";

export function GoogleAnalytics() {
    
    if (isCookieSet(cookieConsentCookieName) && isCookieConsent(cookieConsentCookieName)) {

        let analytics = document.createElement("script");
        analytics.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=UA-119338300-1");
        document.getElementsByTagName('head')[0].appendChild(analytics);

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('consent', 'default', {
            'ad_storage': 'granted',
            'analytics_storage': 'granted'
        });
        gtag('js', new Date());
        gtag('config', 'UA-119338300-1', {'anonymize_ip': true, 'domains': ['app.signpath.io', 'secure.avangate.com']}); // Google Analytics
        gtag('config', 'AW-744401159', {'anonymize_ip': true, 'domains': ['app.signpath.io', 'secure.avangate.com']}); // Google Ads
    }
}

export default GoogleAnalytics;
