module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "text-shadow-drop-center": "text-shadow-drop-center 0.6s ease both",
      },
      keyframes: {
        "text-shadow-drop-center": {
          "0%": {
            "text-shadow": "0 0 0 transparent",
          },
          "100%": {
            "text-shadow":
              "0 0 3px rgba(192,192,192,0.6), 0 0 6px rgba(192,192,192,0.6), 0 0 9px rgba(192,192,192,0.6)",
          },
        },
      },
    },
  },
  plugins: [],
};