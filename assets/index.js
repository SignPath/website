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
        if (c < cells.length) {
          cells[c].dataset.label = headers[c].innerText;
        }
      }
    }
  }

  // on the pricing page, add the data-labels to all product rows
  var columnLayoutRows = document.body.querySelectorAll('div.column-layout div.features > ul > li');
  if (columnLayoutRows.length) {
    var columnLayoutContentColumnList = document.body.querySelectorAll('div.column-layout div.content > ul');
    for (var i = 0; i < columnLayoutContentColumnList.length; i++) {
      var rows = columnLayoutContentColumnList[i].querySelectorAll('li');
      var columnLayoutRowCounter = 0;
      for (var r = 0; r < rows.length; r++) {
        columnLayoutContentColumnList[i].insertBefore(columnLayoutRows[columnLayoutRowCounter].cloneNode(true), rows[r]);
        columnLayoutRowCounter++;
        if (columnLayoutRows[columnLayoutRowCounter-1].classList.contains('head') ||
            columnLayoutRows[columnLayoutRowCounter-1].classList.contains('sub-head')) {
          columnLayoutContentColumnList[i].insertBefore(columnLayoutRows[columnLayoutRowCounter].cloneNode(true), rows[r]);
          columnLayoutRowCounter++;
        }
      }
    }
  }

  if (window.location.pathname.endsWith('/pricing/') || window.location.pathname.endsWith('/pricing') || window.location.pathname.endsWith('/pricing.html/') || window.location.pathname.endsWith('/pricing.html')) {

    // read params
    let params = {};
    window.location.search.substr(1).split('&').forEach(function(part) {
      var parts = part.split('=');
      if (parts.length > 1) {
        params[parts[0]] = decodeURIComponent(parts[1])
      }
    });

    // read all product codes and set toggle to 3 years if selected is already 3 years
    if (params.currentProductId) {
      var isThreeYearsProduct = false;
      document.querySelectorAll('section.pricing div.content a.footer').forEach(function(productFooter) {
        if (productFooter.dataset['productid_three_years'] == params.currentProductId) {
          isThreeYearsProduct = true;
        }
      })
      if (isThreeYearsProduct) {
        document.getElementById('duration-toggle').checked = true;
      }
    }

    var THREE_YEARS_FACTOR = 0.75;

    // calculate prices correctly
    function recalculatePrices() {

      function determinePrice(options) {
        var r = 
          (
            options.basePrice
            + Math.max(0, Math.min(options.numProjects, options.numProjectsMax) - options.numProjectsIncluded) * options.pricePerProject
            + Math.max(0, Math.min(options.numUsers,    options.numUsersMax)    - options.numUsersIncluded   ) * options.pricePerUser
          )
          * (options.threeYears ? THREE_YEARS_FACTOR : 1);
        return r
      }

      function format(price, currency) {
        var n = Math.round(parseFloat(price));
        return currency == '€' ? ( n + ' €') : ( '$' + n );
      }
      
      var currency = document.getElementById('currency-toggle').checked ? '€' : '$';
      var threeYears = document.getElementById('duration-toggle').checked;
      var numProjects = parseInt(document.getElementById('num-projects-input').value, 10);
      var numUsers = parseInt(document.getElementById('num-users-input').value, 10);

      var numSubscriptionsAvailable = 0;

      document.querySelectorAll('section.pricing div.content').forEach(function(productCtn) {

        var basePrice           = parseInt(productCtn.querySelector('.price').dataset.base_price, 10);
        var numProjectsIncluded = parseInt(productCtn.querySelector('.num-projects').dataset.num_projects_included, 10);
        var numProjectsMax      = parseInt(productCtn.querySelector('.num-projects').dataset.num_projects_max, 10);
        var pricePerProject     = parseInt(productCtn.querySelector('.num-projects').dataset.price_per_project, 10);
        var numUsersIncluded    = parseInt(productCtn.querySelector('.num-users').dataset.num_users_included, 10);
        var numUsersMax         = parseInt(productCtn.querySelector('.num-users').dataset.num_users_max, 10);
        var pricePerUser        = parseInt(productCtn.querySelector('.num-users').dataset.price_per_user, 10);
        var numReleaseSignings  = parseInt(productCtn.querySelector('.num-release-signings').dataset.value, 10);
        var numTestSignings     = parseInt(productCtn.querySelector('.num-test-signings').dataset.value, 10);
        var numGBPerProject     = parseInt(productCtn.querySelector('.num-gb-per-project').dataset.value, 10);
        var numCIPipelines      = parseInt(productCtn.querySelector('.num-ci-pipelines').dataset.value, 10);
        var ciPipelinesPerProject = productCtn.querySelector('.num-ci-pipelines').dataset.ci_pipelines_per_project == 'true';

        if (numProjects > numProjectsMax || numUsers > numUsersMax) {
          productCtn.classList.add('match-failed');
        } else {
          productCtn.classList.remove('match-failed');
          numSubscriptionsAvailable++;
        }
        productCtn.querySelector('.num-projects').innerHTML = Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax);
        productCtn.querySelector('.num-users').innerHTML    = Math.min(Math.max(numUsersIncluded,    numUsers), numUsersMax);

        var options = {
          basePrice: basePrice,
          threeYears: threeYears,
          numProjects: numProjects,
          numProjectsIncluded: numProjectsIncluded,
          numProjectsMax: numProjectsMax,
          pricePerProject: pricePerProject,
          numUsers: numUsers,
          numUsersIncluded: numUsersIncluded,
          numUsersMax: numUsersMax,
          pricePerUser: pricePerUser
        }

        productCtn.querySelector('.price').innerText = format(determinePrice(options), currency);
        productCtn.querySelector('.price-sub').style.visibility = threeYears ? 'visible' : 'hidden';
        productCtn.querySelector('.num-release-signings').innerHTML = numReleaseSignings * Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax);
        productCtn.querySelector('.num-test-signings').innerHTML    = numTestSignings    * Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax);
        productCtn.querySelector('.num-gb-per-project').innerHTML  =  (numGBPerProject     * Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax)) + ' GB';
        productCtn.querySelector('.num-individual-signatures-per-project').innerHTML = new Intl.NumberFormat().format((numGBPerProject     * Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax)) * 1024 * 1024);
        if (ciPipelinesPerProject) {
          productCtn.querySelector('.num-ci-pipelines').innerHTML  = numCIPipelines     * Math.min(Math.max(numProjectsIncluded, numProjects), numProjectsMax);
        }
        productCtn.querySelectorAll('.currency-amount').forEach(function(ctn) {
          ctn.innerText = format(parseFloat(ctn.dataset.value) * (threeYears ? THREE_YEARS_FACTOR : 1), currency);
        });

        var productid = productCtn.querySelector('a.footer').dataset[threeYears ? 'productid_three_years' : 'productid_one_year']
        if (params.currentProductId) { // update links
          productCtn.querySelector('a.footer').innerText = 'Change';
          productCtn.querySelector('a.footer').href = document.documentElement.dataset.appurl 
            + '/Web/' 
            + params.organizationId 
            + '/Subscription/CompleteChange?productId=' 
            + productid 
            + '&paymentToken=' 
            + encodeURIComponent(params.paymentToken)
            + '&AdditionalCheckoutParameters='
            + encodeURIComponent('&OPTIONS=' + encodeURIComponent(
                'num_projects_' + productid + '=' + Math.min(Math.max(numProjects, numProjectsIncluded), numProjectsMax)
              + ',num_users_'   + productid + '=' + Math.min(Math.max(numUsers, numUsersIncluded), numUsersMax)
            ));
        } else {
          productCtn.querySelector('a.footer').href = 'https://secure.avangate.com/order/checkout.php?PRODS=' 
            + productid 
            + '&QTY=1&CART=1&CARD=1&CLEAN_CART=1&CURRENCY=' 
            + (currency == '$' ? 'USD' : 'EUR') 
            + '&DCURRENCY=' + (currency == '$' ? 'USD' : 'EUR')
            + '&OPTIONS' + productid + '='
            + 'num_projects_' + productid + encodeURIComponent('=' + Math.min(Math.max(numProjects, numProjectsIncluded), numProjectsMax))
            + ',num_users_' + productid + encodeURIComponent('=' + Math.min(Math.max(numUsers, numUsersIncluded), numUsersMax));
        }
      })

      document.querySelector('.editions-dialog').style.display = numSubscriptionsAvailable > 0 ? 'none' : 'block';
    }

    document.querySelectorAll('section.pricing div.toggle input').forEach(function(input) {
      input.addEventListener('change', recalculatePrices);
    });

    document.querySelectorAll('section.pricing div.number-select > input').forEach(function(input) {
      input.addEventListener('change', recalculatePrices);
    })

    document.querySelectorAll('section.pricing div.number-select > i').forEach(function(i) {
      function changeCounter(e) {
        var input = e.target.parentNode.querySelector('input');
        input.value = i.classList.contains('la-plus-circle') ? parseInt(input.value, 10) + 1 : Math.max(1, parseInt(input.value, 10) -1);
        recalculatePrices();
      }

      i.addEventListener('click', changeCounter);
    })

    recalculatePrices();

    window.addEventListener("pageshow", () => {
      document.getElementById('num-users-input').value = params['num_users'] || 1;
      document.getElementById('num-projects-input').value = params['num_projects'] || 1;
      recalculatePrices();
    });
  }

  // set cookie acknowledgement
  // functions taken from https://www.w3schools.com/js/js_cookies.asp
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
      setCookie(cookieConsentCookieName, 'true', 356 * 20); // expires in 20 years
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

