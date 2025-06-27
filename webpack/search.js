export function search() {
	document.querySelectorAll('header li.search span')[0].addEventListener('click', function() {
		document.querySelectorAll('header li.search input')[0].focus();
	});
	document.querySelectorAll('header li.search span')[0].addEventListener('focus', function() {
		document.querySelectorAll('header li.search input')[0].focus();
	});

	document.querySelectorAll('header li.search input')[0].addEventListener('input', function(e) {
		if (e.target.value.length == 0) {
			e.target.parentNode.parentNode.parentNode.classList.remove('with-search-term');
		} else {
			e.target.parentNode.parentNode.parentNode.classList.add('with-search-term');
		}
		
	});

	const url = new URL(location);
	if (url.pathname == '/search') {
		const searchText = url.searchParams.get('q');
		document.querySelectorAll('main section.top-section h1')[0].innerText += ` for "${ searchText }"`;
		document.querySelectorAll('main input[type=search]')[0].value = searchText;
	}
}