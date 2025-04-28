export function headerlinks() {
	document.querySelectorAll("article h1,h2,h3").forEach(headerElem => {
		let headerId = headerElem.id;
		if (headerId) {
			headerElem.classList.add("headerlink");
			var a = document.createElement('a');
			a.className = 'link';
			a.innerHTML = '#';
			a.href=`#${headerId}`
			headerElem.appendChild(a);
		}
	});
}