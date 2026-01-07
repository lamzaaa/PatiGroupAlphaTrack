import { animate, stagger, utils } from 'animejs';
import { rem } from './utilities';

export const animateComponent = {
	shakingAnimation: () => {
		animate(utils.$('#fixed-tool li:not(.scrollToTop) .icon img'), {
			rotate: [0, 45, -15, 15, 0],
			duration: 600,
			loop: true,
			delay: stagger(600),
			ease: 'linear',
		});
	},
	helperIcon: () => {
		document.body.addEventListener('svg-loaded', e => {
			const { element, isError } = e.detail;
			if (isError) return;
			const helperIcon = element.closest('.helper-icon');
			if (!helperIcon) return;
			const hand = utils.$(helperIcon.querySelector('.hand'));
			const left = utils.$(helperIcon.querySelector('.left'));
			const right = utils.$(helperIcon.querySelector('.right'));
			animate(hand, {
				x: [rem(-14), rem(14)],
				loop: true,
				alternate: true,
				ease: 'linear',
			});
			utils.set([left, right], {
				transformOrigin: 'center',
				'transform-box': 'fill-box',
			});
			animate(left, {
				strokeOpacity: [1, 0.6],
				loop: true,
				alternate: true,
				scale: [1, 0.8],
			});
			animate(right, {
				strokeOpacity: [0.6, 1],
				loop: true,
				alternate: true,
				scale: [0.8, 1],
			});
		});
	},
	init: () => {
		animateComponent.shakingAnimation();
		// animateComponent.helperIcon();
	},
};
