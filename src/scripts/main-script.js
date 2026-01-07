if (import.meta.hot) {
	import.meta.hot.accept(() => {
		// Reload the page when this module changes
		window.location.reload();
	});
}

import $ from 'jquery';
import { lenis } from '../../lib/lenis-instance';
import {
	activeCommonNav,
	customTab,
	debounce,
	generateSVG,
	isTouchDevice,
	lozadInit,
	onLoadToSection,
	stickElementToEdge,
	toggleFaqsAskModule,
} from '../../lib/utilities';
import { globalJS } from '../../lib/global';
import { fancyboxSetting } from '../../lib/fancyboxSetting';
import { swiperInit } from '../../lib/SwiperInit';
import { counterUpNumber } from '../../lib/counterUp';
import { animateComponent } from '../../lib/animateComponent';
globalThis.$ = globalThis.jQuery = $;

//
export let scriptPath = ``;
function getScriptPath() {
	const mainScript = document.querySelector('script[src*="main-script.js"]');
	if (mainScript && mainScript.src) {
		const isOnLocal = mainScript.src.includes('/src');
		let lastPart = isOnLocal
			? mainScript.src.lastIndexOf('/src/scripts/main-script.js')
			: mainScript.src.lastIndexOf('/scripts/main-script.js');
		scriptPath =
			lastPart !== -1 ? mainScript.src.substring(0, lastPart + 1) : '';
	} else if (
		typeof window.lz !== 'undefined' &&
		typeof window.lz === 'object' &&
		typeof window.lz.updateScriptPath !== 'undefined'
	) {
		scriptPath = window.lz.updateScriptPath;
	}
}
getScriptPath();

// ******* Global Variable s*******

// *** Window
export const ww = $(window).width();
// *** Header *** //
export const overlay = $('#overlay');
export const body = $('body');
// *** Nav Mobile *** //
export const nav_mobile = $('.nav-mobile');
export const isTouchScreenOrMobile = ww < 1200 || isTouchDevice();

function scriptsOnFontLoaded() {
	document.fonts.ready.then(() => {
		// var t0 = performance.now();
		// var t1 = performance.now();
		// console.log("Call to homepage took " + (t1 - t0) + " milliseconds.");
	});
}

const FE = {
	lozadInit,
	// closeFancybox: fancyboxSetting.closeFancybox,
	// triggerFancybox: fancyboxSetting.triggerFancybox,
	// debounce,
	// toast,
};
window.FE = FE;

$(document).ready(function () {
	scriptsOnFontLoaded();
	generateSVG();
	// *** Lenis *** //
	lenis.init();
	// *** Global Function *** //
	fancyboxSetting.init();
	globalJS.init();
	animateComponent.init();
	// *** Swiper *** //
	swiperInit();
	// Utilities
	lozadInit();
	stickElementToEdge();
	activeCommonNav();
	counterUpNumber();
	// *** Template *** //
	//
	// *** Tab *** //
	customTab();
	toggleFaqsAskModule();
	// *** Fancybox *** //

	// FE.triggerFancybox('popup-form'); // Popup form product detail
	// FE.triggerFancybox('popup-apply-form', 'popup-form popup-apply-form'); // Popup career detail
});

const debouncedResize = debounce(function () {
	stickElementToEdge();
}, 200);

$(window).on('resize', function () {
	debouncedResize();
});

$(window).trigger('resize');

// ***** Preload ***** //
document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
		/**
		 * Turn on when Deploy
		 */

		//
		//
		//
		//
		// Load to section
		onLoadToSection();
	}
};
