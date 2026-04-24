module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          100: "#ffd6c4",
          200: "#ffb293",
          300: "#ff8f68",
        },
        ink: "#090b11",
        sand: {
          50: "#fff8ef",
          200: "#f7d7b3",
          300: "#ebc087",
        },
      },
      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Space Grotesk"', '"Pretendard"', '"Noto Sans KR"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
