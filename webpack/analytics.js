import { cookieConsentCookieName, isCookieConsent, isCookieSet } from './cookie.js';
import Cookies from 'js-cookie';
let gtag_ref = undefined;

const CLICK_TIMEOUT_FOR_ANALYTICS_EVENT = 50; // in ms

export function GoogleAnalytics() {
  let analytics = document.createElement('script');
  analytics.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-CX618DRF59');
  document.getElementsByTagName('head')[0].appendChild(analytics);
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('consent', 'default', {
    ad_storage: 'granted',
    analytics_storage: 'granted',
  });
  gtag('js', new Date());
  gtag('config', 'G-CX618DRF59', { anonymize_ip: true, domains: ['app.signpath.io', 'secure.avangate.com'] }); // Google Analytics
  gtag('config', 'UA-119338300-1', { anonymize_ip: true, domains: ['app.signpath.io', 'secure.avangate.com'] }); // Google Analytics
  gtag('config', 'AW-744401159', { anonymize_ip: true, domains: ['app.signpath.io', 'secure.avangate.com'] }); // Google Ads
  gtag_ref = gtag;
  initEvents();
}

const events = {
  1: { eventCategory: 'free_trial_link', eventAction: 'click', eventLabel: '"Start free trial" link clicked' }, // Every time a user clicks on any of the "Start free trial" links
  2: { eventCategory: 'buy_link', eventAction: 'click', eventLabel: '"Buy" link clicked' }, // Every time a user clicks on one of the "Buy" links on https://about.signpath.io/product/pricing
  3: { eventCategory: 'contact_form', eventAction: 'submitted', eventLabel: '"Contact Form" submitted' }, // Every time a user submits the contact form
  4: { eventCategory: 'subscribe_newsletter_link', eventAction: 'click', eventLabel: '"Subscribe Newsletter" link clicked' }, // Every time a user clicks on the "Subscribe" link for the newsletter
  5: { eventCategory: 'page_time', eventAction: 'more_than_2_mins', eventLabel: 'User stayed more than 2 mins' }, // Every time a user stays on the site for more than 2 mins
  6: { eventCategory: 'scroll_50', eventAction: 'scrolled', eventLabel: 'User scrolled more than 50%' }, // Every time a user scrolls further than 50% of the page height
  7: { eventCategory: 'scroll_80', eventAction: 'scrolled', eventLabel: 'User scrolled more than 80%' }, // Every time a user scrolls further than 80% of the page height
  8: { eventCategory: 'mail_link', eventAction: 'click', eventLabel: '"Mailto:" link clicked' }, // Every time a user clicks on any of the "email" links
  9: { eventCategory: 'click', eventAction: 'login', eventLabel: '"Login" link clicked' }, // Every time a user clicks the login button
};

export function initEvents() {
  document.querySelectorAll('.btn.trial').forEach((item) => {
    item.addEventListener('click', (event) => {
      triggerEvent(1);
    });
  });
  document.querySelectorAll('.btn.btn-primary.footer.buy').forEach((item) => {
    item.addEventListener('click', (event) => {
      triggerEvent(2);
    });
  });
  document.querySelectorAll('#helpdesk_ticket_submit').forEach((item) => {
    item.addEventListener('click', (event) => {
      triggerEvent(3);
    });
  });
  document.querySelectorAll('.btn.newsletter').forEach((item) => {
    item.addEventListener('click', (event) => {
      triggerEvent(4);
    });
  });
  trackUserSiteTime();
  trackScroll(0.5);
  trackScroll(0.8);
  document.querySelectorAll('a[href*="mailto"]').forEach((item) => {
    item.addEventListener('click', (event) => {
      if (item.href.split(':')[1].includes('@')) {
        triggerEvent(8, item.href.split(':')[1]);
      }
    });
  });

  document.querySelectorAll('a').forEach(item => {
    if (item.href.includes('/Web/Home/Login')) {
      const href = item.href;
      item.href = '#';

      item.addEventListener('click', async (event) => {
        triggerEvent(9);
        await new Promise((r) =>
          setTimeout(function () {
            window.location.href = href;
          }, CLICK_TIMEOUT_FOR_ANALYTICS_EVENT)
        );
      });
    }
  });
}

function trackUserSiteTime() {
  /*
   * The cookie 'sessionstart' holds the last time the user opened the session (reset every 12 hours)
   */
  if (Cookies.get('sessionstart')) {
    var sessionstart = new Date(Date.parse(Cookies.get('sessionstart')));
    if (sessionstart) {
      var diffInSec = (Date.now() - sessionstart.getTime()) / 1000;
      if (diffInSec > (3600 * 12)) { // 12 hours have elapsed since last visit -> start new session
        resetSessionCookie()
      } else { // an active session that's less than 12 hours old
        if (diffInSec <= 120) {
          trigger2MinSession(diffInSec);   
        }
      }
    } else { // invalid cookie -> start new session
      resetSessionCookie();
    }
  } else { // no cookie set -> start new session
    resetSessionCookie();
  }
}

function resetSessionCookie() {
  Cookies.set('sessionstart', (new Date(Date.now())).toISOString(), { expires: 1 })
  trigger2MinSession(0)
}

function trigger2MinSession(sessionAgeInSecs) {
  setTimeout(function() {
    triggerEvent(5);
  }, (120 - sessionAgeInSecs) * 1000)
}

function trackScroll(percentage = 0.5) {
  let active = true;
  document.addEventListener(
    'scroll',
    debounce(() => {
      if (document.documentElement.scrollHeight * percentage < window.scrollY + window.innerHeight && active) {
        if (percentage === 0.5) {
          active = false;
          triggerEvent(6, window.location.href);
        }
        if (percentage === 0.8) {
          active = false;
          triggerEvent(7, window.location.href);
        }
      }
    }, 1000)
  );

  function debounce(e, t = 300) {
    let u;
    return (...i) => {
      clearTimeout(u),
        (u = setTimeout(() => {
          e.apply(this, i);
        }, t));
    };
  }
}

function triggerEvent(id, label = null) {
  gtag_ref('event', events[id].eventAction, {
    event_category: events[id].eventCategory,
    event_label: label ? label : events[id].eventLabel,
  });
}

export default GoogleAnalytics;
