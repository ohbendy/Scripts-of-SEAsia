/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography"

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,svx,ts,tsx,vue}'],
	theme: {
		extend: {
			screens: {
				'3xl': '2560px'
			}
		},
	},
	plugins: [
		typography
	],
}
