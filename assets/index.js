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
    document.querySelectorAll('section.pricing-main div.toggle input').forEach(function(input) {
      input.addEventListener('change', recalculatePrices);
    });

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
      document.querySelectorAll('div.product a.footer').forEach(function(a) {
        a.innerText = 'Change';
        a.href = 'https://app.signpath.io/Web/' + params.organizationId + '/Subscription/CompleteChange?productId=' + a.dataset.productid + '&paymentToken=' + encodeURIComponent(params.paymentToken);
      })
    }
  }
})
