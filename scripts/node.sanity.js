const fixtures = require("../src/__tests__/__fixtures__");

const openpgp = require("openpgp");

(async () => {
  const privKeyObj = (await openpgp.key.readArmored(
    fixtures.keypairs.secp256k1.privateKey
  )).keys[0];
  await privKeyObj.decrypt(fixtures.passphrase);

  const data = "hello";
  const signed = await openpgp.sign({
    message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
    privateKeys: [privKeyObj], // for signing
    detached: true
  });

  console.log(signed);
})();
