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
			document.querySelectorAll('section.changelog div[class^=component-], section.changelog article.release').forEach(function(componentDiv) {
				console.log(componentDiv.classList);
				console.log(`component-${select.value}`);
				if (componentDiv.classList.contains(`component-${select.value}`)) {
					componentDiv.style.display = 'block';
				} else {
					componentDiv.style.display = 'none';
				}
			});
		});
	}
}