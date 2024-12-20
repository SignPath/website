export function carousel() {
	/**
	 * carousel has the following items
	 * 
	 *                       Viewport
	 *            +---------------------------+
	 * .out-left  | .active   .show   .show   | .out-right
	 *            +---------------------------+
	 * 
	 */
	document.querySelectorAll("div.carousel").forEach((carousel) => {
		let numCarouselItems = getNumCarouselItems();

		initCarousel(carousel, numCarouselItems, startAutoMovement);

		// constantly moving
		let interval = undefined;
		function startAutoMovement() {
			if (interval) {
				clearInterval(interval);
				interval = undefined;
			}
			interval = setInterval(function() {
				moveCarousel(carousel.querySelector('ul'), false, numCarouselItems);
			}, 3000)
		}

		startAutoMovement();
		
	})
}

function initCarousel(carousel, numCarouselItems, startAutoMovement) {
	// initialize carousel
		carousel.querySelectorAll('li').forEach((li, i) => {
			if (i == 0) { li.classList.add('out-left'); } else
			if (i == 1) { li.classList.add('active'); } else 
			if (i == numCarouselItems + 1) { li.classList.add('out-right'); } else
			if (i <= numCarouselItems) { li.classList.add('show'); }
		});

		carousel.querySelectorAll('a').forEach((a, i) => {
			if (i == 0) {
				a.addEventListener('click', function(e) {
					let ul = e.currentTarget.parentNode.querySelector('ul');
					moveCarousel(ul, true, numCarouselItems);
					startAutoMovement();
					e.preventDefault();
				});
			} else {
				a.addEventListener('click', function(e) {
					let ul = e.currentTarget.parentNode.querySelector('ul');
					moveCarousel(ul, false, numCarouselItems);
					startAutoMovement();
					e.preventDefault();
				})
			}
		})
}

function getNumCarouselItems() {
	let bodyWidth = document.body.clientWidth;
	if (bodyWidth > 1000) return 3;
	if (bodyWidth > 700) return 2;
	return 1; 
}

function moveCarousel(ul, moveRight, numCarouselItems) {
	function normalizeIndex(index) {
		function inner() {
			if (index < 0) return ul.children.length + index;
			if (index >= ul.children.length) return index - ul.children.length;
			return index;
		}
		let r = inner();
		return r;
	}

	let activeElem = ul.querySelector('li.active');
	let currentIndex = Array.from(ul.children).indexOf(activeElem);
	let leftItem = ul.children[normalizeIndex(currentIndex-1)];
	let showItems = Array.from({length: numCarouselItems - 1}, (_, i) => ul.children[normalizeIndex(currentIndex + 1 + i)]);
	let rightItem = ul.children[normalizeIndex(currentIndex + numCarouselItems)];

	leftItem.classList.remove('out-left');
	if (moveRight) leftItem.classList.add('active');
	leftItem.style.order = moveRight ? 1 : 'initial';

	activeElem.classList.remove('active');
	activeElem.classList.add(moveRight ? 'show' : 'out-left');
	activeElem.style.order = moveRight ? 2 : 0;

	showItems.forEach((showItem, i) => {
		if (i == 0 && !moveRight) {
			showItem.classList.remove('show');
			showItem.classList.add('active');
		}
		if ((i == numCarouselItems - 2) && moveRight) {
			showItem.classList.remove('show');
			showItem.classList.add('out-right');
		}
		showItem.style.order = moveRight ? (3 + i) : (1 + i);
	});
	rightItem.classList.remove('out-right');
	if (!moveRight) rightItem.classList.add(numCarouselItems == 1 ? 'active' : 'show');
	rightItem.style.order = moveRight ? 'initial' : numCarouselItems;

	// add new left out / right-out items
	if (moveRight) {
		ul.children[normalizeIndex(currentIndex - 2)].classList.add('out-left');
		ul.children[normalizeIndex(currentIndex - 2)].style.order = 0;
	} else {
		ul.children[normalizeIndex(currentIndex + numCarouselItems + 1)].classList.add('out-right');
		ul.children[normalizeIndex(currentIndex + numCarouselItems + 1)].style.order = (numCarouselItems + 1);
	}
}

export default carousel;