/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'vignan-blue': '#1E3A8A',
                'vignan-cyan': '#06B6D4',
                'vignan-red': '#DC2626',
                'vignan-yellow': '#FCD34D',
                'vignan-accent': '#06B6D4',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
