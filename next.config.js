const withPWA = require("next-pwa");

module.exports = withPWA({
  reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
  env: {
    serverHost: "https://wb-s.herokuapp.com/",
    socketHost: "wss://wb-s.herokuapp.com/",
    // serverHost: "http://localhost:8100/",
    // socketHost: "http://localhost:8100/",
  },
});
