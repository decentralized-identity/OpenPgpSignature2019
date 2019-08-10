const crypto = require("crypto");

// JSON-LD takes a long time ot verify and sign because it makes network requests.
jest.setTimeout(30 * 1000);

Object.defineProperty(global.self, "crypto", {
  value: {
    getRandomValues: arr => crypto.randomBytes(arr.length)
  }
});
