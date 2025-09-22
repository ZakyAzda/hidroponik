/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Gunakan paket baru di sini
    autoprefixer: {},
  },
};

module.exports = config;