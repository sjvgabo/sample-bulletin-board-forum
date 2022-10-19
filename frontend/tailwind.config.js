/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      visibility: ["group-hover"],
      colors: {
        "bb-background": "#94a3b8",
        primary: "#262626",
        secondary: "#334155",
      },
    },
  },
  plugins: [],
};
