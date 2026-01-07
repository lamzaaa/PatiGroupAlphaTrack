import Toastify from "toastify-js"
import $ from "jquery"
// import "toastify-js/src/toastify.css"

const NOTIFICATION_TYPES = ["success", "error", "warning", "info"]

let timeout = null
export const toast = {
	// Generate methods for each notification type
	...NOTIFICATION_TYPES.reduce((methods, type) => {
		methods[type] = (message, options) =>
			toast.toast(message, options, type)
		return methods
	}, {}),

	toast: (message, options = {}, type = "success") => {
		const isExitToast = $(".toastify")
		if (isExitToast.length > 0) {
			isExitToast.removeClass("on")
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				isExitToast.remove()
			}, 300)
		}
		Toastify({
			text: `<div class="toastify-content"><span class="toastify-icon"></span><span class="message">${message}</span></div>`,
			escapeMarkup: false,
			gravity: "bottom",
			position: "center",
			onClick() {
				console.log(this)
			},
			className: `${type}`,
			...options,
		}).showToast()
	},
}
