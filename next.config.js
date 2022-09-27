/** @type {import('next').NextConfig} */
const intercept = require("intercept-stdout");

// safely ignore recoil stdout warning messages
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return "";
  }
  return text;
}
intercept(interceptStdout);

const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({
  reactStrictMode: true,
});
