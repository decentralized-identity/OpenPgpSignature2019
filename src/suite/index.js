const openpgp = require("openpgp");

const encoding = require("./encoding");

const sign = async ({ verifyData, privateKey, options }) => {
  let privateKeyObject = privateKey;
  if (typeof privateKey === "string") {
    privateKeyObject = (await openpgp.key.readArmored(privateKey)).keys[0];
  }

  if (privateKeyObject.keyPacket.isEncrypted) {
    if (!options.passphrase) {
      throw new Error("passphrase is required in signature options.");
    }
    await privateKeyObject.decrypt(options.passphrase);
  }

  const { signature } = await openpgp.sign({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    privateKeys: [privateKeyObject], // for signing
    detached: true
  });

  return options.compact ? encoding.compact(signature) : signature;
};

const verify = async ({ verifyData, signature, publicKey }) => {
  const armoredSignature =
    signature.indexOf("PGP SIGNATURE") === -1
      ? encoding.expand(signature)
      : signature;

  const verified = await openpgp.verify({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(armoredSignature), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys // for verification
  });
  return verified.signatures[0].valid; // true
};

module.exports = {
  sign,
  verify
};
