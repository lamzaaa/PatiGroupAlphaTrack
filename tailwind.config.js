import plugin from 'tailwindcss/plugin';

/**
 * @param {number} value
 * @param {number} min
 */
function clamp(min, max = min) {
	const minPx = parseFloat(min);
	const maxPx = parseFloat(max);
	const maxValue = (maxPx / 1920) * 100 + 'rem';
	return `clamp(${minPx}px, ${maxValue}, ${maxValue})`;
}

function r(value) {
	return (value / 1920) * 100 + 'rem';
}

const ROOT_FONT_SIZE = 19.2;

export default {
	content: ['./src/**/*.{html,js,pug}'],
	blocklist: ['container'],
	theme: {
		screens: {
			xs: '380px',
			sm: '576px',
			md: '768px',
			lg: '1024px',
			xl: '1200px',
			'1.5xl': '1366px',
			'2xl': '1440px',
			'3xl': '1600px',
		},
		extend: {
			backgroundImage: {
				default: 'linear-gradient(139deg, #27A451 -25.75%, #006EB4 122.55%)',
			},
			boxShadow: {
				4: '0 16px 24px 0 rgba(31, 34, 39, 0.06)',
				light: `0 ${r(4)} ${r(40)} 0 rgba(0, 0, 0, 0.08)`,
				medium: `${r(4)} ${r(4)} ${r(8)} ${r(4)} rgba(0, 0, 0, 0.24)`,
				hard: `${r(8)} ${r(8)} ${r(16)} ${r(8)} rgba(0,0,0,0.4)`,
			},
			textShadow: {
				base: `0 0 ${r(25)} rgba(0, 0, 0, 0.10)`,
				Light: `${r(4)} ${r(4)} ${r(40)} 0 rgba(0,0,0,0.04)`,
				Medium: `${r(4)} ${r(8)} ${r(8)} ${r(4)} rgba(0,0,0,0.12)`,
				Hard: `0 ${r(10)} ${r(10)} 0 rgba(0,0,0,0.2)`,
			},
			transitionDelay: {
				none: '0ms',
				...Object.fromEntries(
					Array.from({ length: 50 }, (_, i) => (i + 1) * 100).map(ms => [
						ms,
						`${ms}ms`,
					])
				),
			},
			transitionDuration: {
				none: '0ms',
				...Object.fromEntries(
					Array.from({ length: 50 }, (_, i) => (i + 1) * 100).map(ms => [
						ms,
						`${ms}ms`,
					])
				),
			},
			zIndex: {
				...Object.fromEntries(
					Array.from({ length: 100 }, (_, i) => [i + 1, i + 1])
				),
			},
			lineHeight: {
				normal: 'normal',
				initial: 'initial',
			},
			fontFamily: {
				heading: ['Lora', 'serif'],
				body: ['Nunito', 'sans-serif'],
				Awesome6: ["'Font Awesome 6 Pro'"],
				Awesome6Brands: ["'Font Awesome 6 Brands'"],
			},
			colors: {
				transparent: 'transparent',
				extraColor: {
					textPrimary: '#4C4D4F',
				},
				primary: {
					1: '#039869',
					2: '#f3eee0',
					3: '#ffffff',
					4: '#f8961d',
					5: '#272a6e',
				},
				secondary: {
					1: '#2270ba',
					2: '#eca500',
					3: '#f06e22',
					4: '#8e451f',
					'5-ESG': '#7abc39',
					'6-ESG': '#5dc360',
					bg1: '#192443',
					bg2: '#192443',
					bg3: '#192443',
					bg4: '#192443',
					bg5: '#192443',
					bg6: '#192443',
				},
				Utility: {
					50: '#f6f6f6',
					100: '#efefef',
					200: '#dcdcdc',
					300: '#bdbdbd',
					400: '#989898',
					500: '#818181',
					600: '#656565',
					700: '#525252',
					800: '#464646',
					900: '#3d3d3d',
					950: '#292929',
					'Error-1': '#e30e00',
					'Error-2': '#e30e00',
					'Error-3': '#e30e00',
					'Correct-1': '#0079d5',
					'Correct-2': '#0079d5',
					'Correct-3': '#0079d5',
				},
				Black: {
					50: '#f5f5f7',
					100: '#efefef',
					200: '#dcdcdc',
					300: '#bdbdbd',
					400: '#989898',
					500: '#656565',
					600: '#818181',
					700: '#525252',
					800: '#464646',
					900: '#3d3d3d',
					950: '#292929',
				},
				neutral: {
					50: '#f6f6f6',
					100: '#efefef',
					200: '#dcdcdc',
					300: '#bdbdbd',
					400: '#989898',
					500: '#818181',
					600: '#656565',
					700: '#525252',
					800: '#464646',
					900: '#3d3d3d',
					950: '#292929',
				},
				gray: {
					50: '#F5F5F5',
					100: '#DDD',
					200: '#BBBBBB',
					300: '#2E3545',
					400: '#777777',
					500: '#555555',
					600: '#404040',
					700: '#2B2B2B',
					800: '#151515',
					900: '#221F1F',
				},
				ccc: '#ccc',
			},
			borderRadius: {
				...Object.fromEntries(
					Array.from({ length: 100 }, (_, i) => [i + 1, r((i + 1) * 4)])
				),
			},
			borderWidth: {
				DEFAULT: clamp(1),
				tan: 'thin',
				2: clamp(2),
				3: clamp(3),
				4: clamp(4),
				8: clamp(8),
			},
			outlineWith: {
				tan: 'thin',
				2: clamp(2),
				3: clamp(3),
				4: clamp(4),
			},
			typography: {
				DEFAULT: {
					css: {
						// "--tw-prose-headings": 'theme("colors.primary.2")',
						'--tw-prose-body': 'inherit',
						'h1,h2,h3,h4,h5,h6': {
							fontSize: clamp(18, 20),
							fontWeight: '700',
							lineHeight: 1.3,
							// color: "theme('colors.primary.1')",
							// "@media (min-width: theme('screens.xl'))": {
							// 	fontSize: r(20),
							// },
						},
						'strong,b': {
							color: 'inherit',
							fontWeight: '700',
						},
						blockquote: {
							color: '#white',
						},
						figcaption: {
							fontSize: r(15),
						},
						fontSize: 'inherit',
						lineHeight: 'inherit',
						'*': { margin: `${r(16)} 0` },
						'> *:first-child': { marginTop: 0 },
						'> *:last-child': { marginBottom: 0 },
						div: { margin: `${r(16)} 0` },
						margin: 0,
						maxWidth: 'unset',
						blockquote: {
							borderInlineStartColor: "theme('colors.primary.1')",
							backgroundColor: "theme('colors.secondary.1')",
							paddingTop: r(12, 16),
							paddingBottom: r(12, 16),
							fontStyle: 'normal',
						},
						iframe: {
							maxWidth: '100%',
						},
						a: {
							color: '#0000EE',
							textDecoration: 'underline',
							'&:hover': {
								color: "theme('colors.primary.1')",
							},
							'&:visited': {
								color: '#551A8B',
							},
						},
						ul: {
							'padding-left': r(24),
							li: {
								paddingLeft: 0,
								margin: '0 0',
								'&::marker': {
									color: "theme('colors.neutral.950')",
								},
							},
						},
						table: {
							td: {
								border: 'thin solid #e8e8e8',
								padding: '0.5rem',
							},
						},
					},
				},
			},
		},
		fontSize: {
			xs: [clamp(12)],
			sm: [clamp(14)],
			base: [clamp(15, 16), { lineHeight: 1.4 }],
			'15px': [clamp(14, 15)],
			lg: [clamp(18)],
			xl: [clamp(20)],
			'2xl': [clamp(24)],
			'3xl': [clamp(30)],
			'4xl': [clamp(36)],
			'5xl': [clamp(48)],
			'6xl': [clamp(48)],
			'7xl': [clamp(72), { lineHeight: '1' }],
			'8xl': [clamp(84), { lineHeight: '1' }],
			'9xl': [r(128), { lineHeight: 1.25 }],
			'14px': [clamp(14)],
			'13px': [clamp(13)],
			'16px': [clamp(16)],
			'17px': [clamp(17)],
			'18px': [clamp(18)],
			'20px': [clamp(20)],
			'22px': [clamp(22)],
			'24px': [clamp(24)],
			'25px': [clamp(25)],
			'28px': [clamp(28)],
			'30px': [clamp(30)],
			'32px': [clamp(32)],
			'36px': [clamp(36)],
			'40px': [clamp(40)],
			'42px': [clamp(42)],
			'45px': [clamp(45)],
			'50px': [clamp(50)],
			'54px': [clamp(54)],
			'55px': [clamp(55)],
			'56px': [clamp(56)],
			'60px': [clamp(60)],
			'64px': [clamp(64)],
			'80px': r(80),
			'96px': r(96),
			'128px': r(128),
			0: ['0', { lineHeight: '0' }],
		},
		spacing: {
			'dynamic-screen': '100dvh',
			unset: 'unset',
			...Object.fromEntries([
				[0, 0],
				['1px', r(1)],
				...[
					'0.5',
					'1.5',
					'2.5',
					'4.5',
					'5.5',
					'6.5',
					'8.5',
					'9.5',
					'11.5',
					'13.5',
					'14.5',
					'15.5',
					'19.5',
					'20.5',
					'23.5',
					'28.5',
					'32.5',
					'35.5',
					'37.5',
					'43.5',
					'47.5',
				].map(num => [num, r(parseFloat(num) * 4)]),
				...[...Array(100).keys()]
					.filter(n => n > 0)
					.map(num => [num, r(num * 4)]),
			]),
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		plugin(function ({ addBase, addComponents, addVariant, theme }) {
			addBase({});
			addComponents([
				{
					'.base-gap': {
						gap: 16,
						'@screen sm': {
							gap: 24,
						},
						'@screen xl': {
							gap: r(40),
						},
					},

					'.allow-touchMove': {
						cursor: 'grab',
					},
					'.absolute-full': {
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
					},
					'.img-full': {
						'img, picture': {
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						},
					},
					'.heading-28': {
						fontSize: clamp(24, 28),
						lineHeight: 1.4,
					},
				},
			]);
			addVariant('optional', '&:optional');
			addVariant('supports-grid', '@supports (display: grid)');
		}),
		plugin(function ({ addUtilities, theme, e }) {
			const maxWidthClamp = values => {
				return values.reduce((acc, value) => {
					acc[`.max-w-${e(`clamp-${value}`)}px`] = {
						maxWidth: clamp(value),
					};
					return acc;
				}, {});
			};
			const minWidthClamp = values => {
				return values.reduce((acc, value) => {
					acc[`.min-w-${e(`clamp-${value}`)}px`] = {
						minWidth: clamp(value),
					};
					return acc;
				}, {});
			};
			const minHeightClamp = values => {
				return values.reduce((acc, value) => {
					acc[`.min-h-${e(`clamp-${value}`)}px`] = {
						minHeight: clamp(value),
					};
					return acc;
				}, {});
			};

			const values = Array.from({ length: 1920 }, (_, i) => i);
			addUtilities(maxWidthClamp(values), ['responsive']);
			addUtilities(minWidthClamp(values), ['responsive']);
			addUtilities(minHeightClamp(values), ['responsive']);
		}),
		plugin(function ({ addVariant }) {
			addVariant(
				'hover-fine',
				'@media (hover: hover) and (pointer: fine) { & }'
			);
		}),
		plugin(({ addVariant, addUtilities, matchUtilities, e, theme }) => {
			matchUtilities(
				{
					ratio: value => {
						const [numerator, denominator] = value.split('/');
						if (!numerator || !denominator) return {};

						const paddingTop =
							(parseFloat(numerator) / parseFloat(denominator)) * 100;
						return { paddingTop: `${paddingTop}%` };
					},
				},
				{
					type: 'any',
				}
			);
			const breakpoints = theme('screens');
			Object.keys(breakpoints).forEach(breakpoint => {
				matchUtilities(
					{
						[`${breakpoint}:ratio`]: value => {
							const [numerator, denominator] = value.split('/');
							if (!numerator || !denominator) return {};

							const paddingTop =
								(parseFloat(numerator) / parseFloat(denominator)) * 100;
							return { paddingTop: `${paddingTop}%` };
						},
					},
					{
						type: 'any',
					}
				);
			});
			addVariant('rem', ({ container, separator }) => {
				container.walkRules(rule => {
					rule.selector = `.${e(`rem${separator}`)}${rule.selector.slice(1)}`;
					rule.walkDecls(decl => {
						if (decl.value.includes('clamp(')) {
							// If the value already uses setClamp, simplify it
							decl.value = decl.value.replace(
								/clamp\((.*?),\s*(.*?)\s*,.*?\)/,
								(_, min, calc) => {
									// Remove 'calc' and add opening parenthesis
									return calc.replace(/^calc\s*\((.*)\)$/, 'calc($1').trim();
								}
							);
						} else if (decl.value.includes('px')) {
							// Convert the pixel number to rem
							let value = decl.value.replace(
								/(-?\d+(\.\d+)?)px/g,
								(match, p1) => {
									return `${p1 / ROOT_FONT_SIZE}rem`;
								}
							);
							if (decl.prop === 'letter-spacing') {
								let newValue = decl.value.replace(
									/(-?\d+(\.\d+)?)px/g,
									(match, p1) => p1
								);
								value = `${newValue / ROOT_FONT_SIZE}rem`;
							}
							decl.value = value;
						}
					});
				});
			});
			addVariant('px', ({ container, separator }) => {
				container.walkRules(rule => {
					rule.selector = `.${e(`px${separator}`)}${rule.selector.slice(1)}`;
					rule.walkDecls(decl => {
						if (decl.value.includes('rem')) {
							const value = decl.value.replace(
								/(-?\d+(\.\d+)?)rem/g,
								(match, p1) => {
									const realPx = parseFloat(p1) * ROOT_FONT_SIZE;
									return Math.round(realPx);
								}
							);
							decl.value = value + 'px';
						}
					});
				});
			});
			addVariant('percentage', ({ container, separator }) => {
				container.walkRules(rule => {
					rule.selector = `.${e(`percentage${separator}`)}${rule.selector.slice(
						1
					)}`;
					rule.walkDecls(decl => {
						if (decl.value.indexOf('/') != -1) {
							if (rule.selector.includes('text-')) {
								decl.prop = 'font-size';
							}

							const [min, max] = decl.value.split('/');
							decl.value = `${(min / max) * 100}%`;
						}
					});
				});
			});
			addVariant('%', ({ container, separator }) => {
				container.walkRules(rule => {
					rule.selector = `.${e(`%${separator}`)}${rule.selector.slice(1)}`;
					rule.walkDecls(decl => {
						if (decl.value.indexOf('/') != -1) {
							if (rule.selector.includes('text-')) {
								decl.prop = 'font-size';
							}

							const [min, max] = decl.value.split('/');
							decl.value = `${(min / max) * 100}%`;
						}
					});
				});
			});
			addVariant('clamp', ({ container, separator }) => {
				container.walkRules(rule => {
					rule.selector = `.${e(`clamp${separator}`)}${rule.selector.slice(1)}`;
					rule.walkDecls(decl => {
						if (decl.value.indexOf('/') != -1) {
							if (rule.selector.includes('text-')) {
								decl.prop = 'font-size';
							}

							const [min, max] = decl.value.split('/');
							const minValue = min.split('px')[0];
							const maxValue = max.split('px')[0];
							decl.value = clamp(minValue, maxValue);
						} else {
							if (decl.value.includes('px')) {
								const value = decl.value.replace(
									// /(-?\d+)px/g,
									/(-?\d+(\.\d+)?)px/g,
									(match, p1) => {
										return clamp(p1);
									}
								);
								decl.value = value;
							} else if (decl.value.includes('rem')) {
								const value = decl.value.replace(
									/(-?\d+(\.\d+)?)rem/g,
									(match, p1) => {
										const realPx = parseFloat(p1) * ROOT_FONT_SIZE;
										return clamp(realPx);
									}
								);
								decl.value = value;
							}
						}
					});
				});
			});
		}),
	],
};
