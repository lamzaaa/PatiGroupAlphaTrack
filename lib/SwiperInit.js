import Swiper from "swiper";
import {
	Thumbs,
	Autoplay,
	Mousewheel,
	Navigation,
	Scrollbar,
} from "swiper/modules";

export function swiperInit() {
	const AUTO_PLAY_DELAY = 4500;

	// **** Share layout slide **** //
	window.autoSwiper = [];

	$(".productdetail-1").each(function (e) {
		const name = `productdetail-1-${e}`;
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
			slidesPerView: "auto",
		});
		var main = new Swiper(`.${name} .main .swiper`, {
			modules: [Thumbs, Navigation, Autoplay],
			spaceBetween: 0,
			slidesPerView: "auto",
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
					autoSlideNextOnThumbSlide(this, `.${name}`, ".thumb");
				},
			},
		});

		handleAutoplay(AUTO_PLAY_DELAY, main);
	});
	$(".productdetail-10").each(function (e) {
		const name = `productdetail-10-${e}`;
		const $this = $(this);
		$this.addClass(name);
		var main = new Swiper(`.${name} .swiper`, {
			modules: [Navigation, Autoplay, Scrollbar],
			spaceBetween: 0,
			slidesPerView: "auto",
			speed: 500,
			observer: true,
			observeParents: true,
			watchSlidesProgress: true,
			navigation: {
				prevEl: `.${name} .button-prev`,
				nextEl: `.${name} .button-next`,
			},
			scrollbar: {
				el: `.${name} .swiper-scrollbar`,
				draggable: true,
			},
		});

		// handleAutoplay(AUTO_PLAY_DELAY, main);
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
		.hasClass("auto-detect-video");
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

		swiper.on("beforeSlideChangeStart", function () {
			isReachEnd = swiper.isEnd;
			isReachStart = swiper.isBeginning;
		});

		$(navigationEl.prevEl).on("click", function () {
			if (isReachStart) return;

			swiper.autoplay.stop();
			swiper.autoplay.start();
			$(swiper.el).attr("data-auto-play", "stop");
		});

		$(navigationEl.nextEl).on("click", function () {
			if (isReachEnd) return;

			swiper.autoplay.stop();
			swiper.autoplay.start();
			$(swiper.el).attr("data-auto-play", "stop");
		});
	}

	if (thumbSwiper) {
		thumbSwiper.el.addEventListener("mouseenter", () => {
			swiper.autoplay.stop();
			$(swiper.el).attr("data-auto-play", "stop");
		});

		thumbSwiper.el.addEventListener("mouseleave", () => {
			swiper.autoplay.start();
		});
	}

	if (swiperSlides.length > 0) {
		swiperSlides.forEach((slide) => {
			slide.addEventListener("mouseenter", () => {
				swiper.autoplay.stop();
				$(swiper.el).attr("data-auto-play", "stop");
			});
			slide.addEventListener("mouseleave", () => {
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
	if (nextSlide && !nextSlide.classList.contains("swiper-slide-visible")) {
		initSwiper.thumbs.swiper.slideNext();
	} else if (
		prevSlide &&
		!prevSlide.classList.contains("swiper-slide-visible")
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
