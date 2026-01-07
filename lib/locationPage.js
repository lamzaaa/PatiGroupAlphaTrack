import { animate, stagger, utils } from "animejs"

export const locationPage = {
	animateMap: () => {
		document.body.addEventListener("svg-loaded", (e) => {
			const { element, isError } = e.detail
			if (isError) return
			const locationElement = element.closest(".location")
			if (!locationElement) return
			const circles = utils.$(element.querySelectorAll("circle"))
			circles.forEach((circle, index) => {
				if (!circle.getAttribute("opacity")) return
				utils.set(circle, {
					transformOrigin: "center",
					"transform-box": "fill-box",
				})
				animate(circle, {
					opacity: [
						circle.getAttribute("opacity"),
						0.05 + 0.05 * index,
					],
					duration: 1000,
					delay: index * 300,
					scale: [1, 4],
					alternate: true,
					loop: true,
				})
			})
		})
	},
	init: () => {
		locationPage.animateMap()
	},
}
