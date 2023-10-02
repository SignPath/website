export function changelog() {
	// show more functionality
	var link = document.getElementById('show-older-releases-link');
	if (link) {
		link.addEventListener('click', function(e) {
			var div = document.getElementById('older-releases');
			div.style.display = 'block';
			var p = document.getElementById('show-older-releases');
			p.style.display = 'none';
			e.preventDefault();
			e.stopPropagation();
		});
	}

	// filter functionality
	var select = document.getElementById('changelog-component-select');
	if (select) {
		select.addEventListener('change', function(e) {
			// change url
			const url = new URL(location);
			if (select.value == 'all') {
				url.searchParams.delete("component")
			} else {
				url.searchParams.set("component", select.value);
			}
			history.pushState({}, "", url);
			

			show_hide_components(select.value);
			
		});
	}

	// parse url to already show hide components on startup
	const url = new URL(location);
	if (url.searchParams.has('component')) {
		let identifier = url.searchParams.get('component');
		show_hide_components(identifier);
		document.getElementById('changelog-component-select').value = identifier;
	}

	// show/hide <article>s on page
	function show_hide_components(identifier) {
		document.querySelectorAll('section.changelog div[class^=component-], section.changelog article.release').forEach(function(componentDiv) {
			if (identifier == 'all') {
				componentDiv.style.display = 'block';
			} else {
				if (componentDiv.classList.contains(`component-${identifier}`)) {
					componentDiv.style.display = 'block';
				} else {
					componentDiv.style.display = 'none';
				}
			}
		});
	}
}