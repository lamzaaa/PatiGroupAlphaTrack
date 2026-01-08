if (import.meta.hot) {
	import.meta.hot.accept(() => {
		// Reload the page when this module changes
		window.location.reload();
	});
}

import $ from "jquery";
import { lenis } from "../../lib/lenis-instance";
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
} from "../../lib/utilities";
import { globalJS } from "../../lib/global";
import { fancyboxSetting } from "../../lib/fancyboxSetting";
import { swiperInit } from "../../lib/SwiperInit";
globalThis.$ = globalThis.jQuery = $;

//
export let scriptPath = ``;
function getScriptPath() {
	const mainScript = document.querySelector('script[src*="main-script.js"]');
	if (mainScript && mainScript.src) {
		const isOnLocal = mainScript.src.includes("/src");
		let lastPart = isOnLocal
			? mainScript.src.lastIndexOf("/src/scripts/main-script.js")
			: mainScript.src.lastIndexOf("/scripts/main-script.js");
		scriptPath =
			lastPart !== -1 ? mainScript.src.substring(0, lastPart + 1) : "";
	} else if (
		typeof window.lz !== "undefined" &&
		typeof window.lz === "object" &&
		typeof window.lz.updateScriptPath !== "undefined"
	) {
		scriptPath = window.lz.updateScriptPath;
	}
}
getScriptPath();

// ******* Global Variable s*******

// *** Window
export const ww = $(window).width();
// *** Header *** //
export const overlay = $("#overlay");
export const body = $("body");
// *** Nav Mobile *** //
export const nav_mobile = $(".nav-mobile");
export const isTouchScreenOrMobile = ww < 1200 || isTouchDevice();

function handlePlayVideo() {
	const videos = $(".productdetail-10 .video-frame");
	videos.each(function () {
		const video = $(this).find("video");
		if (!video.get(0)) return;
		const siblingsVideo = $(this)
			.closest(".swiper-slide")
			.siblings()
			.find("video");

		video.on("click", function () {
			togglePlayVideo(video.get(0));

			if (siblingsVideo) {
				siblingsVideo.each(function () {
					const currentSiblingVideo = $(this);
					if (!currentSiblingVideo.get(0).paused) {
						currentSiblingVideo.get(0).pause();
						currentSiblingVideo.removeClass("active");
					}
				});
			}
		});
	});
}
function togglePlayVideo(video) {
	if (video.paused) {
		video.play();
		video.muted = false;
		$(video).addClass("active");
	} else {
		video.pause();
		$(video).removeClass("active");
	}
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
	generateSVG();
	// *** Lenis *** //
	lenis.init();
	// *** Global Function *** //
	fancyboxSetting.init();
	globalJS.init();
	// *** Swiper *** //
	swiperInit();
	// Utilities
	lozadInit();
	stickElementToEdge();
	activeCommonNav();
	// *** Template *** //
	handlePlayVideo();
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

$(window).on("resize", function () {
	debouncedResize();
});

$(window).trigger("resize");

// ***** Preload ***** //
document.onreadystatechange = () => {
	if (document.readyState === "complete") {
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
