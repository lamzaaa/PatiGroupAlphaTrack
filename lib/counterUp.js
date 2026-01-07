import { CountUp } from 'countup.js';

export const counterOptions = {
	enableScrollSpy: true,
	duration: 3,
};

function extractNumberAndText(rawString) {
	let newString = rawString.trim();
	const regex = /^(.*?)(-?\d+(?:[.,]\d+)?)(.*)$/;
	const match = newString.match(regex);

	if (match) {
		const [, prefix, numberString, suffix] = match;

		const decimalSeparator = numberString.includes(',') ? ',' : '.';

		return {
			number: parseFloat(numberString.replace(',', '.')),
			prefix: prefix || null,
			suffix: suffix || null,
			decimalSeparator: decimalSeparator,
		};
	}

	return {
		number: null,
		prefix: newString,
		suffix: null,
		decimalSeparator: null,
	};
}

export function buildCounter(counter, options = {}, returnObject = false) {
	const rawValue = counter.dataset.count || counter.innerHTML;
	const { prefix, number, suffix, decimalSeparator } =
		extractNumberAndText(rawValue);

	const hasGetPositive = counter.getAttribute('data-get-positive');
	if (hasGetPositive) {
		if (number < 0) {
			counter.classList.remove('increase-arrow');
			counter.classList.add('decrease-arrow');
		} else {
			counter.classList.remove('decrease-arrow');
			counter.classList.add('increase-arrow');
		}
	}
	const originalContent = counter.innerHTML;
	const wrapper = document.createElement('span');
	wrapper.className = 'counter-wrapper';
	counter.innerHTML = '';

	if (prefix) {
		const prefixElement = document.createElement('span');
		prefixElement.className = 'counter-prefix';
		prefixElement.innerHTML = prefix;
		wrapper.appendChild(prefixElement);
	}

	const numberElement = document.createElement('span');
	numberElement.className = 'counter-number';
	numberElement.innerHTML = originalContent;
	numberElement.dataset.count = number;
	wrapper.appendChild(numberElement);

	if (suffix) {
		const suffixElement = document.createElement('span');
		suffixElement.className = 'counter-suffix';
		suffixElement.innerHTML = suffix;
		wrapper.appendChild(suffixElement);
	}

	counter.appendChild(wrapper);

	counter = numberElement;

	if (prefix === rawValue && number === null) {
		counter.innerHTML = '';
		return;
	}

	if (Number.isNaN(number)) return;
	const decimalsLength = countDecimals(number);
	const newOptions = { ...counterOptions, ...options };

	if (decimalSeparator === '.') {
		newOptions.decimal = '.';
		newOptions.separator = ',';
	} else {
		newOptions.decimal = ',';
		newOptions.separator = '.';
	}

	if (decimalsLength > 0) {
		newOptions.decimalPlaces = decimalsLength;
	}

	const countUp = new CountUp(counter, number, newOptions);
	if (returnObject) {
		return {
			countUp,
			settings: {
				...newOptions,
				number,
				counter,
			},
		};
	}
	return countUp;
}

export const countDecimals = function (value) {
	const isDecimal = Number.isInteger(Number(value));
	if (isDecimal) return 0;
	let text = value.toString();
	// verify if number 0.000005 is represented as "5e-6"
	if (text.indexOf('e-') > -1) {
		let [base, trail] = text.split('e-');
		let deg = parseInt(trail, 10);
		return deg;
	}
	// count decimals for number in representation like "0.123456"
	if (Math.floor(value) !== value) {
		return value.toString().split('.')[1].length || 0;
	}
	return 0;
};

export function counterUpNumber() {
	var counters = document.querySelectorAll('.counter');
	for (let counter of counters) {
		var countUp = buildCounter(counter);
		countUp.start();
	}
}
