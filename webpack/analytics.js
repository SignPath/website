import {cookieConsentCookieName, isCookieConsent, isCookieSet} from "./cookie.js";
import Cookies from 'js-cookie'
let gtag_ref = undefined

export function GoogleAnalytics() {
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
    gtag_ref = gtag
    initEvents()
}

const events = {
    1: {eventCategory: "free_trial_link", eventAction: "click", eventLabel: "\"Start free trial\" link clicked"}, // Every time a user clicks on any of the "Start free trial" links
    2: {eventCategory: "buy_link", eventAction: "click", eventLabel: "\"Buy\" link clicked"}, // Every time a user clicks on one of the "Buy" links on https://about.signpath.io/product/pricing
    3: {eventCategory: "contact_form", eventAction: "submitted", eventLabel: "\"Contact Form\" submitted"}, // Every time a user submits the contact form
    4: {eventCategory: "subscribe_newsletter_link", eventAction: "click", eventLabel: "\"Subscribe Newsletter\" link clicked"}, // Every time a user clicks on the "Subscribe" link for the newsletter
    5: {eventCategory: "page_visits", eventAction: "visit", eventLabel: "User visited more than one page"}, // Every time a user visits more than one page
    6: {eventCategory: "scroll_50", eventAction: "scrolled", eventLabel: "User scrolled more than 50%"}, // Every time a user scrolls further than 50% of the page height
    7: {eventCategory: "scroll_80", eventAction: "scrolled", eventLabel: "User scrolled more than 80%"}, // Every time a user scrolls further than 80% of the page height
    8: {eventCategory: "mail_link", eventAction: "click", eventLabel: "\"Mailto:\" link clicked"}, // Every time a user clicks on any of the "email" links
    9: {eventCategory: "login_button", eventAction: "click", eventLabel: "\"Login\" link clicked"}, // Every time a user clicks the login button
}

export function initEvents() {
    document.querySelectorAll('.btn.trial').forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(1)
        })
    })
    document.querySelectorAll('.btn.btn-primary.footer.buy').forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(2)
        })
    })
    document.querySelectorAll('#helpdesk_ticket_submit').forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(3)
        })
    })
    document.querySelectorAll('.btn.newsletter').forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(4)
        })
    })
    trackUserPageVisits();
    trackScroll(0.5)
    trackScroll(0.80)
    document.querySelectorAll('a[href*="mailto"]').forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(8)
        })
    })
    document.querySelectorAll("a[href='" + window.location.protocol + '//' + window.location.hostname + '/Web/Home/Login' + "']").forEach(item => {
        item.addEventListener('click', event => {
            triggerEvent(9)
        })
    })
}

function trackUserPageVisits() {
    /*
    The cookie 'vc' with a validity period of 12h tracks whether a user has opened more than one page.

        Valid States:
        0 = on first visit
        1 = on the next call - a GA event is sent here
        2 = after the GA event in order not to send further events

     */
    if (isCookieSet(cookieConsentCookieName) && isCookieConsent(cookieConsentCookieName)) {
        if (Cookies.get('vc') && Cookies.get('vc') === '0') {
            Cookies.set('vc', 1, {expires: 7})
        } else if (Cookies.get('vc') && Cookies.get('vc') === '1') {
            triggerEvent(5)
            Cookies.set('vc', 2, {expires: 7})
        } else if (Cookies.get('vc') !== '2') {
            Cookies.set('vc', 0, {expires: 7})
        }
    }
}

function trackScroll(percentage = 0.5) {
    let active = true;
    document.addEventListener('scroll', debounce(() => {
        if ((document.documentElement.scrollHeight * percentage) < (window.scrollY + window.innerHeight) && active) {
            if (percentage === 0.5) {
                active = false;
                triggerEvent(6)
            }
            if (percentage === 0.80) {
                active = false;
                triggerEvent(7)
            }
        }
    }, 1000))

    function debounce(e, t = 300) {
        let u;
        return (...i) => {
            clearTimeout(u), u = setTimeout(() => {
                e.apply(this, i)
            }, t)
        }
    }
}

function triggerEvent(id) {
    gtag_ref('event', events[id].eventAction, {
        'event_category': events[id].eventCategory,
        'event_label' : events[id].eventLabel
    });

}

export default GoogleAnalytics;
