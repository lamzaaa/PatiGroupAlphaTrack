// import { countLines } from './utilities';

export function handleCellLink() {
	$(document).on('click', '.table-link tbody tr', function (e) {
		e.preventDefault();
		const url = $(this).closest('tr').data('url');
		const isDownload = e.target.closest('.download-cell');
		const file = $(this).find('.download-cell').data('file');
		if (isDownload) {
			window.open(file, '_blank');
			return;
		}
		if (!url) return;
		window.location.href = url;
	});
}

// export function handleCareerDetail() {
// 	const desiredLine = 5;
// 	$('.job-description .box-content').each(function () {
// 		const description = $(this).find('.description');
// 		const preventExpand = $(this).hasClass('prevent-expand');
// 		if (preventExpand || !description.length) return;
// 		const { lines, line_height, innerContentSpacing } = countLines(
// 			description.get(0)
// 		);
// 		if (lines <= desiredLine) return;
// 		const heightOf5Lines = desiredLine * (line_height + innerContentSpacing);
// 		description.css({
// 			'--data-max-height': heightOf5Lines + 'px',
// 			'--data-real-height': description.get(0).scrollHeight + 'px',
// 		});
// 		description.addClass('expandable');

// 		const expandBtn = $(this).find('.btn-expand');
// 		expandBtn.on('click', function () {
// 			description.toggleClass('is-expand');
// 			expandBtn.toggleClass('active');
// 		});
// 	});
// }

function formatBytes(bytes, decimals = 2) {
	if (!+bytes) return '0 Bytes';
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = [
		'Bytes',
		'KiB',
		'MiB',
		'GiB',
		'TiB',
		'PiB',
		'EiB',
		'ZiB',
		'YiB',
	];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function handleApplyForm() {
	$(document).on('click', '.file-clear', function () {
		$(this)
			.closest('.form-group')
			.find('.file-info')
			.slideUp('500', function () {
				$(this).remove();
			});

		$(this).closest('.form-group').find('input[type="file"]').val('');
	});
	$(document).on('change', '.form-upload input[type="file"]', function (event) {
		$(this).closest('.form-group').find('.file-info').remove();
		const errorMessage = event.target.validationMessage;
		console.log('🟩 ~ $ ~ errorMessage:', errorMessage);
		var file = event.target.files[0];
		var size = formatBytes(file.size);
		var name = file.name;
		var type = file.type;
		$(this).closest('.form-group').append("<div class='file-info'></div>");
		$(this)
			.closest('.form-group')
			.find('.file-info')
			.append(`<div class="file-name">${name}</div>`);

		$(this)
			.closest('.form-group')
			.find('.file-info')
			.append(`<div class="file-size">${size}</div>`);

		$(this)
			.closest('.form-group')
			.find('.file-info')
			.append(`<div class="file-type">${type}</div>`);

		$(this)
			.closest('.form-group')
			.find('.file-info')
			.append(
				`<div class="file-clear"><svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M20.6875 20.75C20.3125 21.125 19.625 21.125 19.25 20.75L11 12.4375L2.6875 20.75C2.3125 21.125 1.625 21.125 1.25 20.75C0.875 20.375 0.875 19.6875 1.25 19.3125L9.5625 11L1.25 2.75C0.875 2.375 0.875 1.6875 1.25 1.3125C1.625 0.9375 2.3125 0.9375 2.6875 1.3125L11 9.625L19.25 1.3125C19.625 0.9375 20.3125 0.9375 20.6875 1.3125C21.0625 1.6875 21.0625 2.375 20.6875 2.75L12.375 11L20.6875 19.3125C21.0625 19.6875 21.0625 20.375 20.6875 20.75Z' fill='#012D22'/></svg></div>`
			);
		if (errorMessage) {
			$(this)
				.closest('.form-group')
				.find('.file-info')
				.append(`<div class="file-error">${errorMessage}</div>`);
		}
	});
	var wpcf7Elm = document.querySelectorAll('.wpcf7');
	wpcf7Elm.forEach(function () {
		this.addEventListener(
			'wpcf7invalid',
			function (event) {
				console.log('🟩 ~ this.addEventListener ~ event:', event);
			},
			false
		);
		this.addEventListener(
			'wpcf7mailsent',
			function (event) {
				// const findField = event.detail.inputs.find(({
				//     type
				// }) => type === 'file');
				// console.log("🟩 ~ this.addEventListener ~ findField:", findField)
				$('.form-group').find('.file-info').remove();
			},
			false
		);
	});
}
