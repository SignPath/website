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
	var select_component = document.getElementById('changelog-component-select');
	if (select_component) {
		select_component.addEventListener('change', function(e) {
			// change url
			const url = new URL(location);
			if (select_component.value == 'all') {
				url.searchParams.delete("component")
			} else {
				url.searchParams.set("component", select_component.value);
			}
			history.pushState({}, "", url);
			

			show_hide_components(select_component.value);
			
		});
	}

	var select_change_type = document.getElementById('changelog-change_type-select');
	if (select_change_type) {
		select_change_type.addEventListener('change', function(e) {
			// change url
			const url = new URL(location);
			if (select_change_type.value == 'all') {
				url.searchParams.delete("change_type")
			} else {
				url.searchParams.set("change_type", select_change_type.value);
			}
			history.pushState({}, "", url);
			

			show_hide_change_types(select_change_type.value);
			
		});
	}

	// parse url to already show hide components on startup
	const url = new URL(location);
	if (url.searchParams.has('component')) {
		let component = url.searchParams.get('component');
		show_hide_components(component);
		document.getElementById('changelog-component-select').value = component;

		let change_type = url.searchParams.get('change_type');
		show_hide_change_type(change_type);
		document.getElementById('changelog-change_type-select').value = change_type;
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
		document.getElementById('changelog-feed').href = `/documentation/changelog/feeds/${identifier}.xml`
	}

	function show_hide_change_types(identifier) {
		document.querySelectorAll('section.changelog div[class^=change_type-], section.changelog article.release, section.changelog article.release div.component').forEach(function(changeTypeDiv) {
			if (identifier == 'all') {
				changeTypeDiv.style.display = 'block';
			} else {
				if (changeTypeDiv.classList.contains(`change_type-${identifier}`)) {
					changeTypeDiv.style.display = 'block';
				} else {
					changeTypeDiv.style.display = 'none';
				}
			}
		});
	}
}