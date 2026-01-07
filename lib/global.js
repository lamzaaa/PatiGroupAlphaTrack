import { isTouchDevice } from './utilities';

export const globalJS = {
	autoFillNoImage: () => {
		setTimeout(() => {
			$('img').each(function () {
				if ($(this).get(0).hasAttribute('data-src')) {
					if ($(this).attr('data-src') === '') {
						$(this).attr('data-src', '/no-image.png');
						$(this).attr('src', '/no-image.png');
						$(this).addClass('noImage');
					}
				} else if ($(this).get(0).hasAttribute('src')) {
					if ($(this).attr('src') === '') {
						$(this).attr('src', '/no-image.png');
						$(this).addClass('noImage');
					}
				}
			});
		}, 150);
	},
	autoAppend: () => {
		var appendId = $("[id*='autoAppend-']");
		appendId.each(function (e) {
			var id = $(this).attr('id').slice(11);
			// console.log(id);
			$(this).appendTo("[id*='autoAppendHere-" + id + "']");
			var curHeight = $(this).get(0).scrollHeight;
		});
	},
	autoClone: () => {
		var cloneId = $("[id*='autoClone-']");
		cloneId.each(function (e) {
			var id = $(this).attr('id').slice(10);
			// console.log(id);
			$(this)
				.clone()
				.appendTo("[id*='autoCloneHere-" + id + "']");
		});
	},
	setBackground: () => {
		const positions = ['', 'top', 'left', 'right', 'bottom'];

		positions.forEach(pos => {
			const attr = pos ? `setBackground${pos}` : 'setBackground';
			const selector = `[${attr}]`;
			const elements = document.querySelectorAll(selector);

			const observer = new IntersectionObserver((entries, obs) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const el = entry.target;
						const background = el.getAttribute(attr);
						el.style.backgroundSize = 'cover';
						el.style.backgroundPosition = `${pos} center`;
						el.style.backgroundImage = `url(${background})`;
						obs.unobserve(el); // Only set once
					}
				});
			});

			elements.forEach(el => observer.observe(el));
		});
	},
	scrollToTop: () => {
		$(window).on('scroll', function () {
			if ($(this).scrollTop() >= $('header').outerHeight() * 3) {
				$('.scrollToTop').addClass('active');
			} else {
				$('.scrollToTop').removeClass('active');
			}
		});

		$('.scrollToTop').on('click', function () {
			$('html,body').animate({
				scrollTop: 0,
			});
		});
		$('#fixed-tool a').on('click', function (e) {
			const isHref = $(this).attr('href');
			if (!isHref) return;
			const isValidHref =
				$(this).attr('href').includes('http') ||
				$(this).attr('href').includes('https');
			const isTouch = isTouchDevice();
			if ($(this).hasClass('item') && isValidHref && isTouch) {
				$(this).siblings().attr('click', 'false');
				if (
					$(this).attr('click') === 'false' ||
					$(this).attr('click') === undefined
				) {
					e.preventDefault();
					$(this).attr('click', 'true');
				} else {
					$(this).attr('click', 'false');
				}
			}
		});
	},

	init: () => {
		globalJS.autoFillNoImage();
		globalJS.autoAppend();
		globalJS.autoClone();
		globalJS.setBackground();
		window.setBackground = globalJS.setBackground;
		globalJS.scrollToTop();
	},
};
