/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,ts}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					10: '#F6FBFA',
					20: '#C9E8E3',
					50: '#F0F6D6',
					100: '#B5CE3C',
					200: '#A0B72E',
					300: '#59661A',
					400: '#5EBBA9',
					500: '#29685D',
					600: '#25584F',
					700: '#1B4039',
					'white': '#F5F5F5',
					'red': '#FF6961'

				},
			},
		},
	},
	plugins: [],
};
