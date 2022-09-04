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
    MONGODB_URI:
      "mongodb+srv://carcro:mVa9hbpPWCOMavGP@cluster0.tcbjm0n.mongodb.net/?retryWrites=true&w=majority",
  },
};
