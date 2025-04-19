export function headerlinks() {
	document.querySelectorAll("article h1,h2,h3").forEach(headerElem => {
		let headerId = headerElem.id;
		if (headerId) {
			headerElem.classList.add("headerlink");
			headerElem.addEventListener("click", () => {
				location.hash = headerId;
			});
		}
	});
}