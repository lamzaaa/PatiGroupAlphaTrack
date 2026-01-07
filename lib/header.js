import {
	burger,
	header,
	nav_mobile,
	overlay,
} from '../src/scripts/main-script';
import { createTimeline } from 'animejs';
import { lenis } from './lenis-instance';

export const headerFunction = {
	onScroll: () => {
		var lastScroll = 0;
		$(window).on('scroll', function () {
			var currentScroll = $(this).scrollTop();
			if (currentScroll >= header.outerHeight() / 2) {
				header.addClass('header-active');
				if (currentScroll >= lastScroll) {
					header.addClass('header-scroll');
				} else {
					header.removeClass('header-scroll');
				}
				lastScroll = currentScroll;
			} else {
				header.removeClass('header-active');
			}
		});
		// const scrollHeader_1 = scrollOverElement(header_1) || 0;
		// window.addEventListener("scroll", () => {
		// 	if (scrollHeader_1() === 1) {
		// 		header_2.classList.add("active");
		// 	} else {
		// 		header_2.classList.remove("active");
		// 	}
		// });
	},
	removeActiveCpn: () => {
		burger.removeClass('active');
		overlay.removeClass('active');
		header.removeClass('navMobileOpen');
		nav_mobile.removeClass('active');
		$('.toggle-menu').removeClass('active');
	},
	searchActive: () => {
		//
		$('.search-icon').on('click', function () {
			$(this).addClass('active');
			$('.search-overlay').addClass('active');
			// lenis.stopScroll();
			setTimeout(() => {
				$('.search-overlay .searchbox input').trigger('focus');
			}, 500);
		});
		$('.search-overlay .searchbox input').on('focus', function () {
			$(this).parent().addClass('active');
		});
		$('.search-overlay .searchbox input').on('focusout', function () {
			$(this).parent().removeClass('active');
		});
		$(document).on('click', function (event) {
			var $trigger = $('header .search-icon');
			var $trigger_2 = $('.search-overlay');
			if (
				$trigger !== event.target &&
				!$trigger.has(event.target).length &&
				$trigger_2 !== event.target &&
				!$trigger_2.has(event.target).length &&
				$('.search-overlay').hasClass('active')
			) {
				$('.search-overlay').removeClass('active');
				$('.search-icon').removeClass('active');
				// lenis.resumeScroll();
			}
		});
		$('.close-search').on('click', function () {
			$('.search-overlay').removeClass('active');
			$('.search-icon').removeClass('active');
			// lenis.resumeScroll();
		});
		// Press ESC to close Search
		setTimeout(() => {
			$(window).on('keyup', function (event) {
				var e = event.keyCode;
				if (e == 27) {
					$('.search-overlay').removeClass('active');
					$('.search-icon').removeClass('active');
					$('.mobile-bottom').removeClass('active');
					// lenis.resumeScroll();
				}
			});
		}, 500);
	},
	navMobileSlide: () => {
		burger.on('click', function () {
			nav_mobile.toggleClass('active');
			overlay.toggleClass('active');
			header.toggleClass('navMobileOpen');
			if (burger.hasClass('active')) {
				burger.removeClass('active');
				animateBurger.close();
				lenis.resumeScroll();
			} else {
				burger.addClass('active');
				animateBurger.open();
				lenis.stopScroll();
			}
		});
		$(document).on('click', function (event) {
			var $trigger = $('header #burger');
			var $trigger_2 = $('.nav-mobile');
			if (
				$trigger !== event.target &&
				!$trigger.has(event.target).length &&
				$trigger_2 !== event.target &&
				!$trigger_2.has(event.target).length &&
				$('header').hasClass('navMobileOpen')
			) {
				headerFunction.removeActiveCpn();
				lenis.resumeScroll();
				burger.removeClass('active');
				animateBurger.close();
			}
		});
		$('.nav-mobile .close-nav').on('click', function () {
			headerFunction.removeActiveCpn();
			lenis.resumeScroll();
			animateBurger.close();
		});
	},

	escBtn: () => {
		$(window).on('keyup', function (event) {
			var e = event.keyCode;
			if (e == 27) {
				headerFunction.removeActiveCpn();
				lenis.resumeScroll();
				animateBurger.close();
			}
		});
	},
	toggleChildMenu: () => {
		$(document).on(
			'click',
			'.nav-mobile nav li[class*="has-children"] >.title',
			function (e) {
				if (e.target.nodeName != 'A') {
					// console.log("as");
					$(this).closest('li').toggleClass('toggle-dropdown');
					$(this).closest('li').siblings().find('> .dropdown').slideUp();
					$(this).closest('li').find('> .dropdown').slideToggle();
				}
			}
		);

		$('header nav li.menu-item-type-custom').each(function () {
			$(this).removeClass('current-menu-item');
			$(this).on('click', function (e) {
				$(this).addClass('current-menu-item');
				$(this).siblings().removeClass('current-menu-item');
				var url = $(this).find('a').attr('href');
				var destination = getCurrentHashtag(url);
				if (destination != null)
					if ($(destination)?.offset()?.top)
						$('html, body').animate(
							{
								scrollTop: $(destination).offset().top - height_header,
							},
							'slow'
						);
			});
		});
	},
	init: () => {
		headerFunction.onScroll();
		headerFunction.navMobileSlide();
		headerFunction.searchActive();
		headerFunction.toggleChildMenu();
		headerFunction.escBtn();
	},
};

let burgerTimeline;
const animateBurger = {
	tl: function () {
		const burger = document.getElementById('burger');
		if (!burger) return;
		const defaultSvg = burger.querySelector('.default-burger');
		const openSvg = burger.querySelector('.open-burger');

		// Use a loop to get rects instead of nth-child(1/2/3)
		const defaultRects = Array.from(defaultSvg.querySelectorAll('rect'));
		const openRects = Array.from(openSvg.querySelectorAll('rect'));
		const rectsAttributes = {
			default: [],
			open: [],
		};
		defaultRects.forEach(rect => {
			const values = getElementAttributes(rect);
			rectsAttributes.default.push(values);
		});
		openRects.forEach(rect => {
			const values = getElementAttributes(rect);
			rectsAttributes.open.push(values);
		});

		const animateOpen = rectsAttributes.open.map(attrs => {
			return attrs.reduce((obj, rect) => {
				obj[rect.name] = rect.value;
				return obj;
			}, {});
		});

		const animateSvg = getElementAttributes(openSvg).reduce((obj, rect) => {
			obj[rect.name] = rect.value;
			return obj;
		}, {});

		burgerTimeline = createTimeline({
			autoplay: false,
			duration: 300,
			defaults: {
				duration: 300,
				ease: 'inOutQuart',
			},
		});

		// Add rect animations in a loop
		for (let i = 0; i < defaultRects.length; i++) {
			burgerTimeline.add(
				defaultRects[i],
				{
					...animateOpen[i],
				},
				i === 0 ? undefined : '<<'
			);
		}

		burgerTimeline.add(
			defaultSvg,
			{
				...animateSvg,
			},
			'<<'
		);
	},
	open: () => {
		burgerTimeline.pause();
		burgerTimeline.play();
	},
	close: () => {
		burgerTimeline.pause();
		burgerTimeline.reverse();
	},
};
animateBurger.tl();

function getElementAttributes(element) {
	const attributes = [];
	for (var att, i = 0, atts = element.attributes, n = atts.length; i < n; i++) {
		att = atts[i];
		if (att.nodeName === 'class' || att.nodeName === 'xmlns') {
			continue;
		}
		attributes.push({
			name: att.nodeName,
			value: att.nodeValue,
		});
	}
	return attributes;
}
