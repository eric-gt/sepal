module.exports = {
  content: [
    "./app/**/*.{js,ts,js,tsx}",
    "./pages/**/*.{js,ts,js,tsx}",
    "./components/**/*.{js,ts,js,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
