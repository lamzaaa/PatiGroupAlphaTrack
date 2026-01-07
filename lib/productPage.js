export const productPage = {
	selectProductOption() {
		const options = $('.product-selector-content .option');
		options.on('click', function () {
			const option = $(this);
			option.siblings().removeClass('active');
			option.addClass('active');
		});
	},
	init() {
		productPage.selectProductOption();
	},
};
