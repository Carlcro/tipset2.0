/** @type {import('next').NextConfig} */
const intercept = require("intercept-stdout");

// safely ignore recoil stdout warning messages
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return "";
  }
  return text;
}

// Intercept in dev and prod
intercept(interceptStdout);
module.exports = {
  reactStrictMode: true,
  env: {
    mongodburl:
      "mongodb+srv://carcro:8Pisn4PnWdqVnzVb@cluster0.y9hpyyt.mongodb.net/?",
  },
  staticPageGenerationTimeout: 1000,
};
