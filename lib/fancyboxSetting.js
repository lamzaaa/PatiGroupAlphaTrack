import { Fancybox } from "@fancyapps/ui"

export const fancyboxSetting = {
	getFancyboxOptions: (name = "", options = {}) => {
		return {
			...Fancybox.defaults,
			dragToClose: false,
			mainClass: `${name} has-custom-close-normal-button`,
			tpl: {
				closeButton: `<button data-fancybox-close class='f-button is-close-btn' title='{{CLOSE}}'><i class="fa-light fa-xmark"></i></button>`,
			},
			thumbs: {
				autoStart: true,
			},
			on: {
				done: function () {
					FE.lozadInit()
					console.log(`open ${name}`)
				},
				close: function () {
					console.log("close")
				},
			},
			...options,
		}
	},
	settingFancybox: ($this) => {
		const customFancybox = "data-popup"
		const name = $this.attr(customFancybox)
		if (name && name !== customFancybox) {
			$this.attr(name, "")
			Fancybox.bind(`[${name}]`, fancyboxSetting.getFancyboxOptions(name))
		}
	},
	triggerFancybox: (id, name = "", options) => {
		if (name === "") {
			name = id
		}
		Fancybox.show(
			[{ src: `#${id}`, type: "inline" }],
			fancyboxSetting.getFancyboxOptions(name, options)
		)
	},
	closeFancybox: () => {
		Fancybox.close(false)
	},
	init: () => {
		Fancybox.defaults.Hash = false
		Fancybox.bind("[data-fancybox]")
		Fancybox.bind("[data-nested-fancybox]")
		$("[data-fancybox]").each((index, item) => {
			fancyboxSetting.settingFancybox($(item))
		})
		$("[data-nested-fancybox]").each((index, item) => {
			fancyboxSetting.settingFancybox($(item))
		})

		$("#show-all-photos").on("click", function (e) {
			e.preventDefault()
			const images = $("[data-fancybox='popup-gallery-desktop']")
			images[0].click()
		})
	},
}
