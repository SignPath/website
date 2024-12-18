export function search() {
	document.querySelectorAll('header li.search span')[0].addEventListener('click', function() {
		document.querySelectorAll('header li.search input')[0].focus();
	});

	const url = new URL(location);
	if (url.pathname == '/search') {
		document.querySelectorAll('main section.top-section h1')[0].innerHTML += ` for <i>${ url.searchParams.get('q') }</i>`;
	}
}