'use strict';

generateSlider($('#slider-one'), {
	pagination: true,
	arrows: true,
	autoplay: false,
	autoplayTime: 2000,
	showModal: true,
});

generateSlider($('#slider-two'), {
	pagination: true,
	arrows: false,
	autoplay: true,
	autoplayTime: 2000,
	showModal: true,
});

function generateSlider(container, {
	pagination: showPagination = true,
	arrows = true,
	autoplay = true,
	autoplayTime = 3000,
	showModal = true,
} = {}) {
	let currentIndex = 0;
	let pagination = null;
	let intervalId = null;
	const sliderItems = container.find('.slider-item');
	const sliderItemsCount = sliderItems.length;
	const slideWidth = container.width();
	const sliderTrackWidth = sliderItemsCount * slideWidth;
	const sliderTrack = $(document.createElement('div'))
		.addClass('slider-wrapper')
		.css({ width: sliderTrackWidth + 'px' })
		.append(sliderItems);

	container.append(sliderTrack);


	if (showPagination) renderPagination();
	
	if (arrows) renderArrows();
	
	if (showModal) {
		sliderTrack.on('click', getModal);
		function getModal(event) {
			const slide = event.target.closest('.slider-item');
			if (slide) {
				const modal = $('.modal');
				const modalContent = modal.find('.content');
				const slideClone = slide.clone(true);
				
				modalContent.append(slideClone);

				modal.attr('active', '');
			}
		}
	}

	runAutoplay();

	function runAutoplay() {
		if (!autoplay) return;
		clearInterval(intervalId);
		intervalId = setInterval(function () {
			goToSlide(currentIndex + 1);
		}, autoplayTime);
	}

	function goToSlide(index) {
		const newCurrentIndex = index < 0 ?
			sliderItemsCount - 1
			: index >= sliderItemsCount
				? 0
				: index;
		currentIndex = newCurrentIndex;
		sliderTrack.css({ transform: `translateX(-${slideWidth * newCurrentIndex}px)` });

		runAutoplay();
		if (!showPagination) return;

		for (let i = 0; i < pagination.children().length; i++) {
			const element = $(pagination.children()[i]);
			if (i === currentIndex) {
				element.addClass('active');
			} else {
				element.removeClass('active');
			}

		}
	}

	function renderArrows() {
		const leftArrow = $(document.createElement('div'))
			.addClass('slider-arrow prev-btn')
			.text('<')
			.on('click', function () {
				goToSlide(currentIndex - 1);
			});
		const rightArrow = $(document.createElement('div'))
			.addClass('slider-arrow next-btn')
			.text('>')
			.on('click', function () {
				goToSlide(currentIndex + 1);
			});

		container.append(leftArrow, rightArrow);
	}

	function renderPagination() {
		pagination = $(document.createElement('div'))
			.addClass('pagination')
			.on('click', function (event) {
				const paginationDot = event.target.closest('.pagination-dot');
	
				if (paginationDot) {
					const newCurrentIndex = Number($(paginationDot).attr('data-index'));
					goToSlide(newCurrentIndex);
				}
			});

		for (let i = 0; i < sliderItemsCount; i++) {
			const paginationDot = $(document.createElement('div'))
				.addClass('pagination-dot');

			if (i === currentIndex) {
				paginationDot.addClass('active');
			}

			paginationDot.attr('data-index', i);
			pagination.append(paginationDot);
		}

		container.append(pagination);

	}

}

// Modal
const modal = document.querySelector('.modal');

modal.addEventListener('click', closeModal);

function closeModal(event) {
	if (event.target.matches('.modal')) {
		modal.removeAttribute('active');
		const modalContent = modal.querySelector('.content');

		modalContent.innerHTML = '';
	}
}

