export function changelog() {
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
}