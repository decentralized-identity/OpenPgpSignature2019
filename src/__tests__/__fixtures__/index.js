const passphrase = "correct horse battery staple";
const email = "alice@example.com";

const secp256k1 = require("./keypair.secp256k1.json");

const linkedData = require("./LinkedData.json");

const signed = require("./signed");

module.exports = {
  keypairs: {
    secp256k1
  },
  signed,
  email,
  passphrase,
  linkedData
};
