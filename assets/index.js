// The debounce function receives our function as a parameter
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
storeScroll();



// add data-label attributes
document.addEventListener('DOMContentLoaded', function() {
  var tables = document.body.querySelectorAll('section.resources-section table');
  console.log('found ' + tables.length + ' tables');
  for (var i = 0; i<tables.length; i++) {
    var headers = tables[i].querySelectorAll('th');
    console.log('found ' + headers.length + ' headers for table ' + i);
    var rows = tables[i].querySelectorAll('tbody > tr');
    console.log('updating ' + rows.length + 'rows');
    for (var r = 0; r<rows.length; r++) {
      var cells = rows[r].querySelectorAll('td');
      for (var c = 0; c<headers.length; c++) {
        cells[c].dataset.label = headers[c].innerText;
      }
    }
  }
})