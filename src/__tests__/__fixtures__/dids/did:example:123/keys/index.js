const fs = require("fs");
const path = require("path");

module.exports = {
  key0: {
    publicKey: fs
      .readFileSync(path.resolve(__dirname, "./key0.public.asc"))
      .toString()
  },
  key1: {
    publicKey: fs
      .readFileSync(path.resolve(__dirname, "./key1.public.asc"))
      .toString(),
    privateKey: fs
      .readFileSync(path.resolve(__dirname, "./key1.private.asc"))
      .toString()
  }
};
