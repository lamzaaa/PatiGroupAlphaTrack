import Swiper from 'swiper';
import {
	Thumbs,
	Autoplay,
	EffectFade,
	Mousewheel,
	Navigation,
	Pagination,
	Scrollbar,
	Controller,
	Parallax,
} from 'swiper/modules';
import { animate, createTimeline, spring, utils } from 'animejs';
import { lozadInit } from './utilities';

export function swiperInit() {
	const AUTO_PLAY_DELAY = 4500;

	// **** Share layout slide **** //
	window.autoSwiper = [];
	$('.swiper-column-auto').each(function (e) {
		const $this = $(this);
		if ($this.hasClass('swiper-column-auto-2')) return;
		let isLoop = false;
		let isTouchMove = false;
		let isMouseWheel = false;
		let isAutoHeight = false;
		let isInsideNavMobile = false;
		if ($this.closest('.nav-mobile').length) {
			isInsideNavMobile = true;
		}
		if ($this.hasClass('swiper-loop')) {
			isLoop = true;
		}
		if ($this.hasClass('allow-touchMove')) {
			isTouchMove = true;
		}
		if ($this.hasClass('allow-mouseWheel')) {
			isMouseWheel = {
				forceToAxis: true,
			};
		}
		if ($this.hasClass('auto-height')) {
			isAutoHeight = true;
		}
		let isProductScrollbar = false;
		if ($this.hasClass('slide-product-scrollbar')) {
			isProductScrollbar = true;
		}
		let hasPointerHelper = false;
		if ($this.hasClass('has-pointer-helper')) {
			hasPointerHelper = true;
		}

		const arrowButtons = $this.find('.arrow-button');
		if (arrowButtons.hasClass('contain-pagination')) {
			arrowButtons
				.find('.button-prev')
				.after("<div class='swiper-pagination'></div>");
			// console.log(arrowButtons)
		}

		let time = $(this).attr('data-time') || 3500;

		const name = `swiper-column-auto-id-${e}`;
		$this.addClass(name);

		const options = {
			modules: [Navigation, Pagination, Mousewheel, Scrollbar, Autoplay],
			speed: 500,
			observer: true,
			observeParents: true,
			spaceBetween: 0,
			loop: isLoop,
			slidesPerView: 'auto',
			pagination: {
				el: `.swiper-column-auto-id-${e} .swiper-pagination`,
				clickable: true,
			},
			mousewheel: isMouseWheel,
			allowTouchMove: isTouchMove,
			navigation: {
				prevEl: `.swiper-column-auto-id-${e} .button-prev`,
				nextEl: `.swiper-column-auto-id-${e} .button-next`,
			},
			scrollbar: {
				el: `.swiper-column-auto-id-${e} .swiper-scrollbar`,
				hide: false,
				draggable: true,
			},
			watchSlidesProgress: true,
			autoHeight: isAutoHeight,
			on: {
				beforeInit: function () {
					window.autoSwiper.push(this);
				},
				init: function (swiper) {
					if (isLoop) {
						lozadInit();
						$(this.el)
							.find('.swiper-slide-duplicate a[data-fancybox]')
							.each(function () {
								$(this).removeAttr('data-fancybox');
							});
					}
				},
				afterInit: function () {
					//
				},
				slideChange: function () {
					if ($this.hasClass('auto-detect-video')) {
						$this.find('video')[0].pause();
						$this.find('.swiper-slide').removeClass('play-video');
						$this.find('.play-btn').removeClass('active');
					}
				},

				resize: function (swiper) {
					// console.log("resize ");
					const totalSlidesWidth = swiper.slidesSizesGrid.reduce(
						(acc, curr) => acc + curr,
						0
					);
					swiper.el.classList.toggle(
						'center-slide-active',
						totalSlidesWidth < swiper.size
					);
					autoSetSlidesPerGroup(this);
				},
			},
		};

		if (time == 0) {
			const slides = $this.find('.swiper-slide');
			$this
				.find('.swiper-wrapper')
				.append(slides.clone())
				.append(slides.clone())
				.append(slides.clone());

			options.autoplay = {
				delay: 0,
				// disableOnInteraction: true,
				// pauseOnMouseEnter: false,
			};
			options.loop = true;
			options.speed = 1800;
			delete options.navigation;
		}
		var swiper_column_auto = new Swiper(
			`.swiper-column-auto-id-${e} .swiper:not(.nested-swiper)`,
			{
				...options,
			}
		);

		if ($this.hasClass('auto-play')) {
			if (time != 0) {
				handleAutoplay(time, swiper_column_auto);
			}
		}

		if ($this.find('.swiper-pagination').length) {
			autoSetSlidesPerGroup(swiper_column_auto);
		}
		if (isInsideNavMobile) {
			swiper_column_auto.destroy();
		}
	});

	$('.product-detail-1').each(function (e) {
		const name = `product-detail-1-${e}`;
		const $this = $(this);
		$this.addClass(name);
		// const centerIndex = $this.find(".thumb .swiper-slide").length - 1 || 0;
		var thumb = new Swiper(`.${name} .thumb .swiper`, {
			modules: [Mousewheel],
			speed: 500,
			observer: true,
			observeParents: true,
			spaceBetween: 0,
			slideToClickedSlide: true,
			watchSlidesProgress: true,
			slidesPerView: 'auto',
			direction: 'vertical',
			slidesPerView: 4,
			breakpoints: {
				576: {
					slidesPerView: 4,
				},
			},
		});
		var main = new Swiper(`.${name} .main .swiper`, {
			modules: [Thumbs, Navigation, Autoplay],
			spaceBetween: 0,
			slidesPerView: 'auto',
			// rewind: true,
			thumbs: {
				swiper: thumb,
			},
			speed: 500,
			observer: true,
			observeParents: true,
			watchSlidesProgress: true,
			navigation: {
				prevEl: `.${name} .button-prev`,
				nextEl: `.${name} .button-next`,
			},
			on: {
				slideChange: function () {
					autoSlideNextOnThumbSlide(this, `.${name}`, '.thumb');
				},
			},
		});

		handleAutoplay(AUTO_PLAY_DELAY, main);
	});
}
window.swiperInit = swiperInit;
function handleAutoplay(
	timeout,
	swiper,
	preventMouseEnter = false,
	thumbSwiper = null
) {
	if (!swiper || !swiper.el || !$(swiper.el).length) return;

	let stopSlideImmediate = $(swiper.el[0])
		.parent()
		.hasClass('auto-detect-video');
	if (stopSlideImmediate) return;

	const swiperSlides = swiper.slides;

	// Configure autoplay
	swiper.params.autoplay = {
		delay: timeout,
		disableOnInteraction: !preventMouseEnter,
		pauseOnMouseEnter: !preventMouseEnter,
	};

	swiper.autoplay.start();

	const navigationEl = swiper.params.navigation;
	if (navigationEl) {
		let isReachEnd = false;
		let isReachStart = false;

		swiper.on('beforeSlideChangeStart', function () {
			isReachEnd = swiper.isEnd;
			isReachStart = swiper.isBeginning;
		});

		$(navigationEl.prevEl).on('click', function () {
			if (isReachStart) return;

			swiper.autoplay.stop();
			swiper.autoplay.start();
			$(swiper.el).attr('data-auto-play', 'stop');
		});

		$(navigationEl.nextEl).on('click', function () {
			if (isReachEnd) return;

			swiper.autoplay.stop();
			swiper.autoplay.start();
			$(swiper.el).attr('data-auto-play', 'stop');
		});
	}

	if (thumbSwiper) {
		thumbSwiper.el.addEventListener('mouseenter', () => {
			swiper.autoplay.stop();
			$(swiper.el).attr('data-auto-play', 'stop');
		});

		thumbSwiper.el.addEventListener('mouseleave', () => {
			swiper.autoplay.start();
		});
	}

	if (swiperSlides.length > 0) {
		swiperSlides.forEach(slide => {
			slide.addEventListener('mouseenter', () => {
				swiper.autoplay.stop();
				$(swiper.el).attr('data-auto-play', 'stop');
			});
			slide.addEventListener('mouseleave', () => {
				swiper.autoplay.start();
			});
		});
	}
}

function autoSlideNextOnThumbSlide(initSwiper, element, thumb) {
	let activeIndex = initSwiper.activeIndex + 1;
	let nextSlide = document.querySelector(
		`${element} ${thumb} .swiper-slide:nth-child(${activeIndex + 1})`
	);
	let prevSlide = document.querySelector(
		`${element} ${thumb} .swiper-slide:nth-child(${activeIndex - 1})`
	);
	if (nextSlide && !nextSlide.classList.contains('swiper-slide-visible')) {
		initSwiper.thumbs.swiper.slideNext();
	} else if (
		prevSlide &&
		!prevSlide.classList.contains('swiper-slide-visible')
	) {
		initSwiper.thumbs.swiper.slidePrev();
	}
}

function autoSetSlidesPerGroup(swiper) {
	if (!swiper.pagination.el) return;
	const { visibleSlidesIndexes, slidesSizesGrid } = swiper;
	const slidesPerGroup = getSlidesPerGroup(
		slidesSizesGrid,
		visibleSlidesIndexes
	);
	if (
		slidesPerGroup != null &&
		slidesPerGroup > 0 &&
		slidesPerGroup !== swiper.params.slidesPerGroup
	) {
		swiper.params.slidesPerGroup = slidesPerGroup;
		swiper.update();
	}
}

function getSlidesPerGroup(slidesSizesGrid, visibleSlidesIndexes) {
	const totalSlide = slidesSizesGrid.length;
	const visibleSlide = visibleSlidesIndexes?.length ?? 1;

	let slidesPerGroup = visibleSlide;

	if (totalSlide <= visibleSlide) {
		slidesPerGroup = null;
	}
	return slidesPerGroup;
}

export default function createTripleSlider(el) {
	const swiperEl = el.querySelector('.swiper');
	const bigWrapper = el.closest('.tripple-swiper-wrapper');
	const swiperDuplicates = bigWrapper.querySelectorAll('.swiper-duplicate');

	const swiperPrevEl = swiperEl.cloneNode(true);
	swiperPrevEl.classList.add('triple-slider-prev');

	const swiperPrevSlides = swiperPrevEl.querySelectorAll('.swiper-slide');
	const swiperPrevLastSlideEl = swiperPrevSlides[swiperPrevSlides.length - 1];
	swiperPrevEl
		.querySelector('.swiper-wrapper')
		.insertBefore(swiperPrevLastSlideEl, swiperPrevSlides[0]);

	const swiperNextEl = swiperEl.cloneNode(true);
	swiperNextEl.classList.add('triple-slider-next');

	const swiperNextSlides = swiperNextEl.querySelectorAll('.swiper-slide');
	const swiperNextFirstSlideEl = swiperNextSlides[0];
	swiperNextEl
		.querySelector('.swiper-wrapper')
		.appendChild(swiperNextFirstSlideEl);

	swiperDuplicates.forEach((swiperDuplicate, index) => {
		if (index === 0) {
			swiperDuplicate.appendChild(swiperPrevEl);
		}
		if (index === 1) {
			swiperDuplicate.appendChild(swiperNextEl);
		}
	});

	swiperEl.classList.add('triple-slider-main');

	const commonParams = {
		modules: [Controller, Parallax],
		speed: 600,
		loop: true,
		parallax: true,
		slidesPerView: 'auto',
		observer: true,
		observeParents: true,
		watchSlidesProgress: true,
		on: {
			init: () => {
				lozadInit();
			},
			slideChange: () => {
				lozadInit();
			},
		},
	};

	let tripleMainSwiper;

	const triplePrevSwiper = new Swiper(swiperPrevEl, {
		...commonParams,
		allowTouchMove: false,
		on: {
			click() {
				tripleMainSwiper.slidePrev();
			},
		},
	});
	const tripleNextSwiper = new Swiper(swiperNextEl, {
		...commonParams,
		allowTouchMove: false,
		on: {
			click() {
				tripleMainSwiper.slideNext();
			},
		},
	});
	tripleMainSwiper = new Swiper(swiperEl, {
		...commonParams,
		modules: [...commonParams.modules, Navigation],
		grabCursor: true,
		controller: {
			control: [triplePrevSwiper, tripleNextSwiper],
		},
		initialSlide: 1,
		navigation: {
			prevEl: bigWrapper.querySelector('.button-prev'),
			nextEl: bigWrapper.querySelector('.button-next'),
		},
		on: {
			destroy() {
				triplePrevSwiper.destroy();
				tripleNextSwiper.destroy();
			},
		},
	});
	tripleMainSwiper.controller.control = [triplePrevSwiper, tripleNextSwiper];
	// triplePrevSwiper.controller.control = [tripleMainSwiper]
	// tripleNextSwiper.controller.control = [tripleMainSwiper]

	return tripleMainSwiper;
}
