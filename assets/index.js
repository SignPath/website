/*// The debounce function receives our function as a parameter
const debounce = (fn) => {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  // The debounce function returns a new function that can receive a variable number of arguments
  return (...params) => {
    
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) { 
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(() => {
      
      // Call our function and pass any params we received
      fn(...params);
    });

  } 
};


// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
const storeScroll = () => {
  document.documentElement.dataset.scroll = window.scrollY;
}

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();*/

// The debounce function receives our function as a parameter
function debounce(fn) {

  // This holds the requestAnimationFrame reference, so we can cancel it if we wish
  let frame;

  function myfunc() {
    // If the frame variable has been defined, clear it now, and queue for next frame
    if (frame) { 
      cancelAnimationFrame(frame);
    }

    // Queue our function call for the next frame
    frame = requestAnimationFrame(function() {
      
      // Call our function and pass any params we received
      fn();
    });
  }

  return myfunc;
};


// Reads out the scroll position and stores it in the data attribute
// so we can use it in our stylesheets
function storeScroll() {
  // need to use setAttribute instead of dataset, because IE11 won't pick up on it in the CSS changes otherwise
  document.documentElement.setAttribute('data-scroll', window.pageYOffset);
}

// Listen for new scroll events, here we debounce our `storeScroll` function
document.addEventListener('scroll', debounce(storeScroll), { passive: true });

// Update scroll position for first time
storeScroll();

// polyfill for IE11
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {

  // add data-label attributes
  var tables = document.body.querySelectorAll('section.resources-section table');
  for (var i = 0; i<tables.length; i++) {
    var headers = tables[i].querySelectorAll('th');
    var rows = tables[i].querySelectorAll('tbody > tr');
    for (var r = 0; r<rows.length; r++) {
      var cells = rows[r].querySelectorAll('td');
      for (var c = 0; c<headers.length; c++) {
        cells[c].dataset.label = headers[c].innerText;
      }
    }
  }

  // on the pricing page, add the data-labels to all product rows
  var productRows = document.body.querySelectorAll('section.pricing-main div.top > ul > li');
  if (productRows.length) {
    var productLists = document.body.querySelectorAll('section.pricing-main div.product > ul');
    for (var i = 0; i < productLists.length; i++) {
      var rows = productLists[i].querySelectorAll('li');
      for (var r = 0; r < rows.length; r++) {
        productLists[i].insertBefore(productRows[r].cloneNode(true), rows[r]);
      }
    }
  }

  if (window.location.pathname.endsWith('/pricing')) {
    // calculate prices correctly
    function recalculatePrices() {
      var currency = document.getElementById('currency-toggle').checked ? '€' : '$';
      var period   = document.getElementById('period-toggle'  ).checked ? 'year' : 'month';
      var duration = document.getElementById('duration-toggle').checked ? '3yrs' : '1yr';

      function format(price) {
        var n = Math.round(parseFloat(price) / (period == 'month' ? 12.0 : 1.0));
        return currency == '€' ? ( n + ' €') : ( '$' + n );
      }

      document.querySelectorAll('section.pricing-main div.product').forEach(function(productCtn) {

        // set base prices
        productCtn.querySelectorAll('div.header span.price').forEach(function(span) {
          span.innerText = format(span.dataset['price' + duration]);
        });

        // set additional prices
        productCtn.querySelectorAll('ul.body span.price').forEach(function(span) {
          span.innerText = format(span.dataset.price);
        })
        
        // update period
        document.querySelectorAll('section.pricing-main span.period').forEach(function(span) {
          if (span.innerText.length > 1) {
            span.innerText = 'per ' + period;
          }
        });
      })
      
    }

    function recreateLinks() {
      var currency = document.getElementById('currency-toggle').checked ? '€' : '$';
      var period   = document.getElementById('period-toggle'  ).checked ? 'year' : 'month';
      var duration = document.getElementById('duration-toggle').checked ? '3yrs' : '1yr';

      // deal with links on the pricing page correctly - unfortunately, URL is not supported by IE
      let params = {};
      window.location.search.substr(1).split('&').forEach(function(part) {
        var parts = part.split('=');
        if (parts.length > 1) {
          params[parts[0]] = decodeURIComponent(parts[1])
        }
      })
      if (params.currentProductId) {
        document.getElementById('free-trial-button').style.display = 'none';
      }

      document.querySelectorAll('div.product a.footer').forEach(function(a) {
        var productid = a.dataset[duration == '1yr' ? 'productid_one_year' : 'productid_three_years']

        if (params.currentProductId) { // update links
          a.innerText = 'Change';
          a.href = document.documentElement.dataset.appurl + '/Web/' + params.organizationId + '/Subscription/CompleteChange?productId=' + productid + '&paymentToken=' + encodeURIComponent(params.paymentToken);
        } else {
          a.href = 'https://secure.avangate.com/order/checkout.php?PRODS=' + productid + '&QTY=1&CART=1&CARD=1&CLEAN_CART=1&CURRENCY=' + (currency == '$' ? 'USD' : 'EUR') + '&DCURRENCY=' + (currency == '$' ? 'USD' : 'EUR')
        }
      });
    }

    document.querySelectorAll('section.pricing-main div.toggle input').forEach(function(input) {
      input.addEventListener('change', recalculatePrices);
      input.addEventListener('change', recreateLinks);
    });

    recreateLinks();
  }

  // set cookie acknowledgement
  // functions taken from https://www.w3schools.com/js/js_cookies.asp
  function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
  }

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  var cookieConsentCookieName = 'acknowledged-cookies';
  if (getCookie(cookieConsentCookieName) != 'true') {
    document.getElementById('cookie-info').classList.add('show');
    document.getElementById('acknowledge-cookies-btn').addEventListener('click', function() {
      setCookie(cookieConsentCookieName, 'true');
      document.getElementById('cookie-info').classList.remove('show');
    })
  }

  /** DEVOPS PAGE **/
  document.querySelectorAll('section.devops-section div.tabs > ul > li > a').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var tab = this.dataset.tabkey;
      document.querySelectorAll('section.devops-section div.tabs > div.panel > *').forEach(function(panel) {
        if (panel.dataset.tabcontent == tab) {
            panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      })
      document.querySelectorAll('section.devops-section div.tabs > ul > li > a').forEach(function(header) {
        if (header.dataset.tabkey == tab) {
            header.parentNode.classList.add('active');
        } else {
          header.parentNode.classList.remove('active');
        }
      })
      e.preventDefault();
      return false;
    });
  });
})

