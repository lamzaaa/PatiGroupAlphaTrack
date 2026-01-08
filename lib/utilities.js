import lozad from "lozad";
import "jquery.scrollto";
import { globalJS } from "./global";

export function isTouchDevice() {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

export function getCurrentHashtag(url = window.location.href) {
	let destination = "#" + url.substr(url.indexOf("#") + 1);
	if (window.location.href.indexOf("#") != -1) {
		return decodeURIComponent(destination);
	} else {
		return null;
	}
}

export function clickToSection() {
	$(document).on("click", "a[href^='#']", function (e) {
		e.preventDefault();
		const hashTag = $(this).attr("href");
		if (hashTag === "#") return;
		if ($(this).closest(".sticky-nav").length > 0) return;
		onLoadToSection(hashTag);
	});
}
export function onLoadToSection(hashTag) {
	// console.log(window.tocContent);

	const destination = hashTag || getCurrentHashtag();
	let offset = getHeaderOffset();
	// console.log("🟩 ~ onLoadToSection ~ destination:", destination);
	if (destination != null) {
		if (destination === "#" && destination.length === 1) return;
		var target = document.getElementById(destination.substring(1));
		// console.log("🟩 ~ onLoadToSection ~ target:", target);
		if (target && target.offsetTop) {
			$("html, body").animate(
				{
					scrollTop: target.offsetTop - offset,
				},
				"fast"
			);
		}
		$(`header nav li.menu-item-type-custom a[href*="${destination}"]`)
			.parent()
			.addClass("current-menu-item");
	}
}

export function isSvgFile(src) {
	// Check if the source URL ends with .svg
	return src.toLowerCase().endsWith(".svg");
}

export function convertImgToSvg(imgElement) {
	// Get the src attribute of the img element
	const imgSrc =
		imgElement.getAttribute("src") || imgElement.getAttribute("data-src");
	if (!isSvgFile(imgSrc)) {
		// Alert
		console.error("Not an SVG file:", imgSrc);

		const notSvgImg = document.createElement("img");
		notSvgImg.className = "img-generate";
		notSvgImg.style.opacity = 1;
		notSvgImg.src = imgSrc;
		// Replace the original image element with the new one
		imgElement.parentNode.replaceChild(notSvgImg, imgElement);
		return;
	}

	function setStrokeDashArrayInline(svgContent) {
		// Create a new DOM element to parse the SVG content
		const tempDiv = document.createElement("div");
		tempDiv.innerHTML = svgContent;

		// Find all vector path elements in the SVG
		const vectorPaths = tempDiv.querySelectorAll("path");

		// Iterate through vector paths and calculate the stroke-dasharray
		vectorPaths.forEach((path) => {
			const isContainStrokeDasharray =
				path.getAttribute("stroke-dasharray");
			const pathLength = path.getTotalLength();
			path.style.setProperty("--data-stroke-dasharray", pathLength);
			if (isContainStrokeDasharray) return;
			path.setAttribute("stroke-dasharray", pathLength);
			// console.log(pathLength);
		});

		// Return the modified SVG content
		return tempDiv.innerHTML;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// Fetching Image SVG

				fetch(imgSrc)
					.then((response) => response.text())
					.then((svgContent) => {
						const modifiedSvgContent =
							setStrokeDashArrayInline(svgContent);
						// Create a temporary div element to parse the SVG content
						const tempDiv = document.createElement("div");
						const isError = svgContent.includes(
							"<title>Error</title>"
						);
						tempDiv.className = "svg-generate";
						if (isError)
							tempDiv.innerHTML =
								"<span class='image-not-found'>Image has been removed or moved.</span>";
						else tempDiv.innerHTML = modifiedSvgContent;
						// else tempDiv.innerHTML = svgContent;

						tempDiv.setAttribute("data-src", imgSrc);
						// Replace the img element with the new svg element
						imgElement.parentNode.replaceChild(tempDiv, imgElement);

						const svgLoadedEvent = new CustomEvent("svg-loaded", {
							detail: {
								element: tempDiv,
								source: imgSrc,
								content: modifiedSvgContent,
								svgContent: svgContent,
								isError: isError,
								imgElement,
							},
						});
						document.body.dispatchEvent(svgLoadedEvent);

						// Stop observing the element after it's loaded
						observer.unobserve(imgElement);
					})
					.catch((error) => {
						console.error(
							"Error fetching or replacing image:",
							error
						);
					});
			}
		});
	});
	// Start observing the image element
	observer.observe(imgElement);
}

export function generateSVG(selector = ".image-svg") {
	const imageContainers = document.querySelectorAll(selector);
	imageContainers.forEach((imageContainer) => {
		// Find the img element within each container
		const images = imageContainer.querySelectorAll("img");
		images.forEach((img) => {
			convertImgToSvg(img);
		});
	});
}

export function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

export function isReduceMotionEnabled() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollOverElement(element) {
	let initialScrollPercent = 0;
	element.style.setProperty("--data-scroll", initialScrollPercent);

	window.addEventListener("scroll", () => {
		const elementHeight = element.offsetHeight;
		const scrollY = window.scrollY;
		const scrollPercent = Math.min(scrollY / elementHeight, 1);

		element.style.setProperty("--data-scroll", scrollPercent);
		initialScrollPercent = scrollPercent;
	});

	return () => initialScrollPercent;
}

export function getHeaderOffset() {
	let height = $("header").outerHeight();
	return height;
}

// modern Chrome requires { passive: false } when adding event

export async function appendScripts(scripts) {
	const loadPromises = scripts.map((scriptUrl) => {
		const isExitScript = document.querySelector(
			`script[src="${scriptUrl}"]`
		);
		if (isExitScript) return Promise.resolve(scriptUrl);
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = scriptUrl;
			document.head.appendChild(script);
			script.onload = () => resolve(scriptUrl);
			script.onerror = () =>
				reject(new Error(`Failed to load ${scriptUrl}`));
		});
	});

	return Promise.all(loadPromises);
}
export async function appendStyles(styles) {
	const loadPromises = styles.map((styleUrl) => {
		const isExitScript = document.querySelector(`link[href="${styleUrl}"]`);
		if (isExitScript) return Promise.resolve(styleUrl);
		return new Promise((resolve, reject) => {
			const style = document.createElement("link");
			style.href = styleUrl;
			style.rel = "stylesheet";
			document.head.appendChild(style);
			style.onload = () => resolve(styleUrl);
			style.onerror = () =>
				reject(new Error(`Failed to load ${styleUrl}`));
		});
	});

	return Promise.all(loadPromises);
}

export function stickElementToEdge() {
	var target = $("[stick-to-edge]");
	target.each(function () {
		const $this = $(this);
		const position = $this.attr("stick-to-edge");
		const unstick = $this.attr("unstick-min") || 1024;
		let offset = ($(window).width() - $(".normal-container").width()) / 2;
		if (position === "left") {
			$this.css({
				"margin-left": `-${offset}px`,
				"--ste-ml": `${Math.abs(offset)}`,
			});
		}
		if (position === "right") {
			$this.css({
				"margin-right": `-${offset}px`,
				"--ste-mr": `${Math.abs(offset)}`,
			});
		}
		if ($(window).width() < unstick) {
			$this.removeAttr("style");
			$this.css({
				"--ste-ml": "0",
				"--ste-mr": "0",
			});
		}
	});
}

export function splitItemToColumn() {
	const splitters = $("[data-split]");
	const BREAKPOINTS = {
		default: 0,
		sm: 576,
		md: 768,
		lg: 1024,
		xl: 1200,
	};
	splitters.each(function () {
		const $splitter = $(this);
		const configString = $splitter.attr("data-split");
		const shouldEqualHeight = $splitter.attr("data-equal-height") || false;
		let numColumns;

		if (configString.includes(":")) {
			const splitConfig = configString.split(",").reduce((acc, part) => {
				const [key, value] = part.split(":");
				acc[key.trim()] = parseInt(value, 10);
				return acc;
			}, {});

			const sortedBreakpoints = Object.keys(splitConfig).sort(
				(a, b) => BREAKPOINTS[b] - BREAKPOINTS[a]
			);

			const activeBreakpoint = sortedBreakpoints.find(
				(key) =>
					window.matchMedia(`(min-width: ${BREAKPOINTS[key]}px)`)
						.matches
			);

			numColumns = splitConfig[activeBreakpoint] || 1;
		} else {
			numColumns = parseInt(configString, 10) || 1;
		}
		// const split = parseInt($(this).attr("data-split")) || 1
		const split = numColumns;
		let items = $(this).find(".item").toArray();

		if (!items.length) return;
		items = items.map((item, index) => {
			item.setAttribute("data-index", index);
			item.style.height = "auto";
			return item;
		});
		const itemsLength = items.length;
		$splitter.attr("data-current-split", split);

		$(this).empty();

		for (let i = 0; i < split; i++) {
			const column = document.createElement("div");
			column.setAttribute("data-column", true);
			$(this).append(column);

			const itemsPerColumn = Math.ceil(itemsLength / split);
			const start = i * itemsPerColumn;
			const end = start + itemsPerColumn;

			items.slice(start, end).forEach((item, index) => {
				column.appendChild(item);
			});
		}

		if (shouldEqualHeight && split > 1) {
			const columns = $splitter.find("[data-column]");
			const numRows = columns.first().children(".item").length;

			for (let i = 0; i < numRows; i++) {
				let maxHeight = 0;
				const rowItems = [];

				columns.each(function () {
					const item = $(this).children(".item").get(i);
					if (item) {
						rowItems.push(item);
						maxHeight = Math.max(maxHeight, item.offsetHeight);
					}
				});
				$(rowItems).css("height", `${maxHeight}px`);
			}
		}
	});
}

export function countLines(target) {
	var style = window.getComputedStyle(target, null);
	var height = parseInt(style.getPropertyValue("height"));
	var font_size = parseInt(style.getPropertyValue("font-size"));
	var line_height = parseInt(style.getPropertyValue("line-height"));
	var box_sizing = style.getPropertyValue("box-sizing");
	let innerContentSpacing = 0;

	if (isNaN(line_height)) line_height = font_size * 1.5;

	if (box_sizing == "border-box") {
		var padding_top = parseInt(style.getPropertyValue("padding-top"));
		var padding_bottom = parseInt(style.getPropertyValue("padding-bottom"));
		var border_top = parseInt(style.getPropertyValue("border-top-width"));
		var border_bottom = parseInt(
			style.getPropertyValue("border-bottom-width")
		);
		var margin_top = parseInt(style.getPropertyValue("margin-top"));
		var margin_bottom = parseInt(style.getPropertyValue("margin-bottom"));
		height =
			height -
			padding_top -
			padding_bottom -
			border_top -
			border_bottom -
			margin_top -
			margin_bottom;
		const allContent = $(target).find("*");
		const contentsSpacing = allContent.toArray().reduce((acc, item) => {
			const style = window.getComputedStyle(item, null);
			const margin_top = parseInt(style.getPropertyValue("margin-top"));
			const margin_bottom = parseInt(
				style.getPropertyValue("margin-bottom")
			);
			const padding_top = parseInt(style.getPropertyValue("padding-top"));
			const padding_bottom = parseInt(
				style.getPropertyValue("padding-bottom")
			);
			const border_top = parseInt(
				style.getPropertyValue("border-top-width")
			);
			const border_bottom = parseInt(
				style.getPropertyValue("border-bottom-width")
			);
			return (
				acc +
				margin_top -
				margin_bottom -
				padding_top -
				padding_bottom -
				border_top -
				border_bottom
			);
		}, 0);
		innerContentSpacing = contentsSpacing / allContent.toArray().length;
		height -= contentsSpacing;
	}
	var lines = Math.floor(height / line_height);
	const newHeight = lines * line_height;
	// alert("Lines: " + lines);
	return { lines, line_height, innerContentSpacing };
}

export function rem(value) {
	return (value / 1920) * 100 + "rem";
}

export function checkLastItemList() {
	//
	$("[active-last-list]").each(function () {
		const $this = $(this);
		calculateLastItem($this);
	});
	function calculateLastItem(element) {
		const $this = $(element);
		const column = $this.css("grid-template-columns")
			? $this.css("grid-template-columns").split(" ").length
			: 1;
		const items = $this.find(".item");
		const totalItems = items.length;
		const lastRowItemCount = totalItems % column || column;
		const lastRowStartIndex = totalItems - lastRowItemCount;

		items.removeClass("last-item");

		if (totalItems === 1) {
			items.addClass("one-item-only");
			return;
		} else {
			items.removeClass("one-item-only");
		}

		for (let i = lastRowStartIndex; i < totalItems; i++) {
			$(items[i]).addClass("last-item");
		}
	}
}

export const loading = {
	load: (target) => {
		const $target = $(target);
		const isExitLoading = $target.find(".loading-overlay").length > 0;
		if (isExitLoading) return;
		$target.append(`
			<div class="loading-overlay">
				<div class="loading"></div>
			</div>
		`);
	},
	unload: (target) => {
		const $target = $(target);
		const isExitLoading = $target.find(".loading-overlay").length > 0;
		if (!isExitLoading) return;
		$target.find(".loading-overlay").remove();
	},
};

export function scaleAbleMap(svg) {
	svg.setAttribute("preserveAspectRatio", "xMidYMid");
	svg.removeAttribute("width");
	svg.removeAttribute("height");

	return svg;
}

export function addingButtonArrow() {
	const buttons = document.querySelectorAll(".btn-primary");
	if (buttons.length === 0) return;
	const buttonArrow = document.querySelector(".button-arrow-icon");
	buttons.forEach((button) => {
		const hasIcon =
			button.querySelector("span") ||
			button.querySelector("img") ||
			button.querySelector("i");
		if (hasIcon) {
			const countIcon = button.querySelectorAll("i");
			if (countIcon.length === 1) {
				const newSpan = document.createElement("span");
				newSpan.classList.add("button-arrow-icon");
				newSpan.innerHTML = Array.from(countIcon).map((icon) => {
					return icon.outerHTML + icon.outerHTML;
				});
				button.appendChild(newSpan);
				countIcon.forEach((icon) => {
					icon.remove();
				});
			}
		} else {
			const cloneButtonArrow = buttonArrow.cloneNode(true);
			cloneButtonArrow.querySelectorAll("img").forEach((img) => {
				img.src = img.dataset.src;
				img.setAttribute("data-loaded", true);
			});
			button.appendChild(cloneButtonArrow);
		}
	});
}

export function autoAddSeparateOnMiddleList() {
	$("[separate-group]").each(function () {
		const $this = $(this);
		const items = $this.find("[separate-item]");
		const content = $this.attr("separate-group");
		if (items.length === 0) return;
		$this.find("[separate-line]").remove();
		let itemPerRow = 0;
		let lastKnownTop = -1;
		items.each(function () {
			const currentTop = $(this).offset().top;
			if (lastKnownTop === -1 || currentTop === lastKnownTop) {
				itemPerRow++;
				lastKnownTop = currentTop;
			} else {
				return false;
			}
		});

		if (itemPerRow === 0) {
			itemPerRow = items.length;
		}

		items.each(function (index) {
			const $currentItem = $(this);

			const isLastItemOverall = index === items.length - 1;

			const isLastItemInRow = (index + 1) % itemPerRow === 0;

			if (!isLastItemInRow && !isLastItemOverall) {
				const $separator = $(
					`<span separate-line="">${content}</span>`
				);

				$separator.insertAfter($currentItem);
			}
		});

		let rowCount = Math.ceil(items.length / itemPerRow);
		let lastRowIndex = rowCount - 1;

		const maxHeightPerRow = [];
		for (let i = 0; i < rowCount; i++) {
			const stepsHeight = [];
			items.each(function (e) {
				const isItemOnRow = i === Math.floor(e / itemPerRow);
				if (!isItemOnRow) return;

				const isLastRowItems = i === lastRowIndex;
				if (isLastRowItems) {
					$(this).addClass("last-row-item");
				} else {
					$(this).removeClass("last-row-item");
				}
				const height = $(this).outerHeight();
				stepsHeight.push(height);
			});
			maxHeightPerRow.push(Math.max(...stepsHeight));
		}

		$this.find("[separate-line]").each(function () {
			const $prevItem = $(this).prevAll("[separate-item]").first();
			if ($prevItem.length > 0) {
				const prevItemIndex = items.index($prevItem);
				const rowOfPrevItem = Math.floor(prevItemIndex / itemPerRow);
				if (maxHeightPerRow[rowOfPrevItem]) {
					$(this).css(
						"--data-height",
						maxHeightPerRow[rowOfPrevItem] + "px"
					);
				}
			}
		});

		// items.each(function (e) {
		// 	// console.log("Max height for row " + Math.floor(e / itemPerRow) + ": " + maxHeightPerRow[Math.floor(e / itemPerRow)]);
		// });
	});
}

export function countSlide(swiper, parent) {
	const isLoop = swiper.params.loop;
	const totalSlide = isLoop ? swiper.loopedSlides : swiper.slides.length;
	let currentSlide = 0;
	// console.log(swiper.activeIndex, swiper.realIndex);
	if (swiper.activeIndex > totalSlide) {
		currentSlide = swiper.realIndex;
		if (swiper.realIndex === 0) {
			currentSlide = totalSlide;
		}
	} else {
		currentSlide = swiper.activeIndex;
	}

	const current = parent.find(".current");
	const total = parent.find(".total");
	if (current) {
		current.text(currentSlide + 1);
	}
	if (total) {
		total.text(totalSlide);
	}
}

export function markSlidesOnNewLine(swiper) {
	const { slides } = swiper;
	if (slides.length === 0) return;
	const totalSlides = slides.length;
	const rows = swiper.params.grid.rows || 1;
	const split = totalSlides / rows;
	const slidesPerView = swiper.params.slidesPerView;
	const haveMoreThanOneRow = totalSlides / slidesPerView > 1;
	if (!haveMoreThanOneRow) {
		swiper.el.classList.add("no-row");
	}
	for (let i = 0; i < slides.length; i++) {
		const slide = slides[i];
		const style = window.getComputedStyle(slide);
		const order = parseInt(style.order);
		if (order + 1 > split) {
			slide.setAttribute("data-row", 2);
		} else {
			slide.setAttribute("data-row", 1);
		}
	}
}

export function autoAlignElements(selector = "[auto-align]") {
	$(selector).each(function () {
		const parent = $(this);
		if (!parent.is(":visible")) return;
		const items = parent.find("[auto-align-item]");
		if (items.length === 0) return;

		items.find("[align-element]").css("height", "");

		const rows = [];
		let currentRow = [];
		let currentRowTop = null;

		items.each(function () {
			const item = $(this);
			const itemTop = item.offset().top;

			if (
				currentRowTop === null ||
				Math.abs(itemTop - currentRowTop) < 5
			) {
				if (currentRowTop === null) {
					currentRowTop = itemTop;
				}
				currentRow.push(item);
			} else {
				if (currentRow.length > 0) {
					rows.push(currentRow);
				}
				currentRow = [item];
				currentRowTop = itemTop;
			}
		});

		if (currentRow.length > 0) {
			rows.push(currentRow);
		}

		rows.forEach(function (rowItems) {
			const elementHeights = {};

			rowItems.forEach(function (item) {
				const elements = item.find("[align-element]");

				elements.each(function () {
					const element = $(this);
					const name = element.attr("align-element");
					if (!name) return;

					const height = element.outerHeight();

					if (!elementHeights[name]) {
						elementHeights[name] = 0;
					}

					if (height > elementHeights[name]) {
						elementHeights[name] = height;
					}
				});
			});

			Object.keys(elementHeights).forEach(function (name) {
				const maxHeight = elementHeights[name];
				rowItems.forEach(function (item) {
					item.find(`[align-element="${name}"]`).css(
						"height",
						maxHeight + "px"
					);
				});
			});
		});
	});
}

export function customTab() {
	$("[tab-wrapper]").each(function () {
		const $this = $(this);
		if ($this.data("initialized")) return;
		$this.data("initialized", true);
		$this.addClass("tab-wrapper-initialized");

		const tabValue = $this.attr("tab-wrapper");
		const allowToggle = $this.is("[allow-tab-toggle]");
		const tabMode = $this.attr("tab-mode") || "click";

		let activeValue =
			$this
				.find(`[tab-item=${tabValue}].active`)
				.attr("tab-item-value") ||
			$this.find(`[tab-item=${tabValue}]`).first().attr("tab-item-value");

		let hashTag = window.location.hash.substring(1);
		if (
			hashTag &&
			$this.find(`[tab-item=${tabValue}][tab-item-value='${hashTag}']`)
				.length > 0
		) {
			activeValue = hashTag;
		}

		const activateTab = (value) => {
			const $targetTab = $this.find(
				`[tab-item=${tabValue}][tab-item-value='${value}']`
			);
			const isBecomingActive = allowToggle
				? !$targetTab.hasClass("active")
				: true;

			$this.find(`[tab-item=${tabValue}]`).removeClass("active");
			$this
				.find(`[tab-content=${tabValue}]`)
				.removeClass("active")
				.hide();

			if (isBecomingActive) {
				$targetTab.addClass("active");

				$this.find(`[tab-content=${tabValue}]`).each(function () {
					const $currentContent = $(this);
					const contentValueAttr =
						$currentContent.attr("tab-content-value") || "";

					if (contentValueAttr.split("|").includes(value)) {
						$currentContent.addClass("active").fadeIn(300);
					}
				});
			}

			const hasActiveTab =
				$this.find(`[tab-item=${tabValue}].active`).length > 0;
			if (!hasActiveTab) {
				const $defaultTab = $this.find(
					`[tab-item=${tabValue}][tab-item-value='-1']`
				);
				if ($defaultTab.length > 0) {
					$defaultTab.addClass("active");
					$this
						.find(
							`[tab-content=${tabValue}][tab-content-value='-1']`
						)
						.addClass("active")
						.fadeIn(300);
				}
			}

			const finalActiveValue = isBecomingActive ? value : null;
			$this.trigger("onTabChange", [finalActiveValue, $targetTab]);

			activeCommonNav();
			autoAlignElements();
			toggleContent();
		};

		$this.data("updateTab", activateTab);
		activateTab(activeValue);

		$this.on(tabMode, `[tab-item=${tabValue}]`, function () {
			const $clickedTab = $(this);
			if ($clickedTab.hasClass("active") && !allowToggle) return;

			const value = $clickedTab.attr("tab-item-value");
			activateTab(value);
		});
	});
}
export function updateTab(tabWrapperSelector, value) {
	const $tabWrapper = $(tabWrapperSelector);
	const updateMethod = $tabWrapper.data("updateTab");
	if (updateMethod) {
		const stringValue = String(value);
		updateMethod(stringValue);
	} else {
		console.warn(
			`Tab wrapper ${tabWrapperSelector} not found or not initialized`
		);
	}
}

const lazyLoader = lozad(".lozad", {
	rootMargin: "10px 0px", // syntax similar to that of CSS Margin
	threshold: 0.2, // ratio of element convergence
	enableAutoReload: true, // it will reload the new image when validating attributes changes
	loaded: function (el) {
		globalJS.autoFillNoImage(el);
	},
});
export function lozadInit() {
	lazyLoader.observe();
	window.lazyLoader = lazyLoader;
}

export function extractNumbers(str) {
	let numbers = "";
	for (let i = 0; i < str.length; i++) {
		if (!isNaN(str[i])) {
			numbers += str[i];
		}
	}
	return numbers;
}

export function activeCommonNav() {
	window.scrollTo = $.fn.scrollTo;
	if ($(".primary-nav ul").length) {
		$(".primary-nav ul").scrollTo("li.active", 300);
	}
	if ($(".secondary-nav ul").length) {
		$(".secondary-nav ul").scrollTo("li.active", 300);
	}
	if ($(".nav-wrapper").length) {
		$(".nav-wrapper ul").scrollTo("li.active", 300);
	}
	if ($(".secondary-nav ul").length) {
		$(".secondary-nav ul").scrollTo("li.active", 300);
	}
	if ($(".normal-nav ul").length) {
		$(".normal-nav ul").scrollTo("li.active", 300);
	}
	if ($(".auto-scroll-nav ul").length) {
		$(".auto-scroll-nav ul").scrollTo("li.active", 300);
	}
}

export function youtube_parser(url) {
	var regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	return match && match[7].length == 11 ? match[7] : false;
}

export function expandItem() {
	// Filter Load
	var hasLoadBtn = $("[has-expand-btn]");
	hasLoadBtn.each(function () {
		var $this = $(this);
		var expandBtn = $(this).find(".expand-btn");
		var list = $(this).find(".expand-item").length;
		var count;
		var countMobile = $(this).attr("item-count-mobile");
		countMobile != undefined && countMobile != 0 && ww < 576
			? (count = Number($(this).attr("item-count-mobile")))
			: (count = Number($(this).attr("item-count")));
		var expand = Number($(this).attr("item-expand"));
		var isFlex = false;
		//=// Init

		function init(initValue, thisFunction) {
			thisFunction
				.find(".expand-item")
				.slice(0, initValue)
				.slideDown({
					complete: function () {
						setTimeout(() => {
							$(this).addClass("done-animated");
						}, 300);
					},
				});
			if (list == 0 || list <= initValue) {
				expandBtn.hide();
			}
		}
		init(count, $this);

		// Click
		function expandBtnInit(initCount, thisFunction) {
			count = initCount + expand <= list ? initCount + expand : list;
			thisFunction
				.closest(hasLoadBtn)
				.find(".expand-item")
				.slice(0, count)
				.slideDown({
					complete: function () {
						setTimeout(() => {
							$(this).addClass("done-animated");
						}, 300);
					},
				});
			if (count == list) {
				thisFunction.slideUp();
			}
		}
		expandBtn.on("click", function (e) {
			e.preventDefault();
			expandBtnInit(count, $(this));
		});
	});
}

export function enableSmartHorizontalScroll(speed = 0.5) {
	let activeHorizontalScrollElement = null;

	$(document).on("wheel", "ul", function (event) {
		const element = this;
		const scrollAmount = event.originalEvent.deltaY;

		const isHorizontallyScrollable =
			element.scrollWidth > element.clientWidth;
		if (!isHorizontallyScrollable) {
			return;
		}

		const currentScroll = element.scrollLeft;
		const maxScroll = element.scrollWidth - element.clientWidth;

		const isScrollingLeft = scrollAmount < 0;
		const isScrollingRight = scrollAmount > 0;

		const isAtStart = currentScroll <= 0;
		const isAtEnd = currentScroll >= maxScroll;

		if ((isScrollingLeft && isAtStart) || (isScrollingRight && isAtEnd)) {
			if (typeof lenis !== "undefined") {
				lenis.resumeScroll();
			}
			return;
		}

		event.preventDefault();
		if (typeof lenis !== "undefined") {
			lenis.stopScroll();
		}

		activeHorizontalScrollElement = element;

		element.scrollLeft += scrollAmount * speed;
	});

	$(document).on("mouseleave", "ul", function () {
		if (this === activeHorizontalScrollElement) {
			if (typeof lenis !== "undefined") {
				lenis.resumeScroll();
			}
			activeHorizontalScrollElement = null;
		}
	});
}

export function toggleFaqsAskModule() {
	$(".module-toggle").each(function () {
		const $this = $(this);
		let willOpenAll = $this.attr("data-open-all") || "false";
		let openFirstItem = $this.attr("data-open-first-item") || "false";
		let openAtleastOne = $this.attr("data-open-atleast-one") || "false";
		let showAll = $this.attr("data-show-all") || "false";
		let split = $this.attr("data-split") || 1;
		if (openFirstItem === "" || openFirstItem === "true") {
			$this
				.find(".item")
				.first()
				.addClass("active")
				.find(".top, .trigger-point")
				.addClass("active");
			$this.find(".item").first().find(".bottom").slideDown();
			$this.find(".item-trigger").first().addClass("active");
		}

		if (showAll === "true") {
			$this
				.find(".item")
				.addClass("active")
				.find(".top, .trigger-point")
				.addClass("active")
				.find(".bottom")
				.show();
			$this.find(".item-trigger").addClass("active");
		}

		if (split > 1) {
			$this.addClass(`module-split-${split}`);
			let $items = $this.find(".item");
			let countItems = $items.length;
			let countItemsPerColumn = Math.ceil(countItems / split);
			for (let i = 0; i < split; i++) {
				const $column = $(
					`<div class="split-column split-column-${i}"></div>`
				);
				$this.append($column);
			}
			$items.each(function (index, item) {
				const cloneItem = $(item).clone();
				item.remove();
				cloneItem.addClass(`split-item-${index}`);
				cloneItem.attr("data-index", index);
				// * Push item to columns by item mod number of columns
				// $this.find(`.split-column-${index % split}`).append(cloneItem);
				// let columnIndex = index % split;
				// * Push item to columns by item order
				let columnIndex = Math.floor(index / (countItems / split));
				$this.find(`.split-column-${columnIndex}`).append(cloneItem);
			});
		}
		var item = $(this).find(".item .top, .item .trigger-point");
		var itemTrigger = $(this).find(".item-trigger");
		item.on("click", function () {
			if (split > 1) {
				handleClickMultiColumn($(this).parent());
			} else {
				handleClickSingleColumn($(this).parent());
			}
		});
		itemTrigger.on("click", function () {
			if (split > 1) {
				handleClickMultiColumn($(this));
			} else {
				handleClickSingleColumn($(this));
			}
		});
		function handleClickSingleColumn(currentItem) {
			const index = currentItem.index();

			if (willOpenAll === "" || willOpenAll === "true") {
				currentItem.toggleClass("active");
				currentItem.find(".top").toggleClass("active");
				currentItem.find(".bottom").slideToggle();

				return;
			}
			$this
				.find(".item")
				.not(".item:eq(" + index + ")")
				.find(".top")
				.removeClass("active");
			$this
				.find(".item")
				.not(".item:eq(" + index + ")")
				.find(".bottom")
				.slideUp();
			$this
				.find(".item")
				.not(".item:eq(" + index + ")")
				.removeClass("active");
			$this
				.find(".item-trigger")
				.not(".item-trigger:eq(" + index + ")")
				.removeClass("active");

			if (currentItem.hasClass("active")) {
				if (openAtleastOne === "false") {
					$this.find(".item").removeClass("active");
					$this
						.find(".item")
						.eq(index)
						.find(".top")
						.removeClass("active");
					$this.find(".item").eq(index).find(".bottom").slideUp();
					$this.find(".item-trigger").removeClass("active");
					$this.find(".item-default").addClass("active");
				}
			} else {
				$this.find(".item").eq(index).addClass("active");
				$this.find(".item").eq(index).find(".top").addClass("active");
				$this.find(".item").eq(index).find(".bottom").slideDown();
				$this.find(".item-trigger").eq(index).addClass("active");
				$this.find(".item-default").removeClass("active");
			}
		}

		function handleClickMultiColumn(currentItem) {
			const index = currentItem.attr("data-index");
			const parentColumnIndex = currentItem
				.closest(".split-column")
				.index();
			const isActive = currentItem.hasClass("active");
			let otherItems;
			// * Select all other items in all columns
			if (ww > 1024) {
				otherItems = $this
					.find(`.split-column-${parentColumnIndex}`)
					.find(`.item:not(.split-item-${index})`);
			} else {
				otherItems = $this.find(`.item:not(.split-item-${index})`);
			}

			// * Select all other items in the current column

			otherItems.find(".top").removeClass("active");
			otherItems.find(".bottom").slideUp();
			otherItems.removeClass("active");

			if (isActive) {
				if (openAtleastOne === "false") {
					currentItem.find(".top").removeClass("active");
					currentItem.find(".bottom").slideUp();
					currentItem.removeClass("active");
				}
			} else {
				currentItem.find(".top").addClass("active");
				currentItem.find(".bottom").slideDown();
				currentItem.addClass("active");
			}
		}
	});
}

export function forceHoverOnLargeElement() {
	$(document).on("mouseenter", ".force-hover-active", function () {
		const children = $(this).find(".force-hover-item");
		children.each(function () {
			$(this).addClass("trigger-hover-active");
		});
	});
	$(document).on("mouseleave", ".force-hover-active", function () {
		const children = $(this).find(".force-hover-item");
		children.each(function () {
			$(this).removeClass("trigger-hover-active");
		});
	});
}

export function toggleContent() {
	$(".extend-content-wrapper").each(function () {
		const $this = $(this);
		if (!$this.is(":visible")) {
			return;
		}

		const target = $this.find(".extend-content");
		const btn = $this.find(".extend-btn");
		const isAlreadyActive = target.hasClass("active");

		if (!isAlreadyActive) {
			btn.show();
			$this.removeClass("not-extendable");
		}

		//
		let limitHeight = target.css("max-height");
		let realHeight = target.get(0).scrollHeight;

		if (limitHeight === "100%" || limitHeight === "none") {
			limitHeight = target.parent().outerHeight();
			realHeight = target.outerHeight();
		}

		const isPx = limitHeight.toString().includes("px");
		let px = isPx ? Number(parseInt(limitHeight)) : Number(limitHeight);

		if (px === 0) return;

		if (px >= realHeight && !isAlreadyActive) {
			btn.hide();
			$this.addClass("not-extendable");
			return;
		}

		if (!$this.data("toggle-content-initialized")) {
			$this.data("toggle-content-initialized", true);
			btn.on("click", function () {
				const isActive = $this.hasClass("active");
				target.css("max-height", isActive ? limitHeight : "unset");
				$this.toggleClass("active");
				target.toggleClass("active");
				$(this).toggleClass("active");
			});
		}
	});
}
