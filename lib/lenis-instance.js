import Lenis from "lenis"

export const lenis = {
	setupLenis() {
		// const isSmooth = ww > 1200 ? true : false;
		const isSmooth = false
		const lenis = new Lenis({
			autoRaf: true,
			prevent: (node) => {
				return node.classList.contains("overflow-auto")
			},
			smoothWheel: isSmooth,
		})
		// Use requestAnimationFrame to continuously update the scroll
		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}

		requestAnimationFrame(raf)
		window.bodyLenis = lenis
	},
	stopScroll() {
		window.bodyLenis.stop()
		// document.body.style.overflow = "hidden";
	},
	resumeScroll() {
		window.bodyLenis.start()
		// document.body.style.overflow = "auto";
	},
	init() {
		this.setupLenis()
	},
}
