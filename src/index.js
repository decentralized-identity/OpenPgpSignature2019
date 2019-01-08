const openpgp = require("openpgp");
const crypto = require("crypto");

const { createVerifyData } = require("./common");

const sign = async ({ data, privateKey, creator, created, domain }) => {
  if (!creator) {
    throw new Error("creator is required.");
  }

  const options = {
    type: "OpenPgpSignature2019",
    creator,
    domain,
    nonce: crypto.randomBytes(16).toString("hex"),
    created: created || new Date().toISOString()
  };
  if (!domain) {
    delete options.domain;
  }
  const verifyData = await createVerifyData(data, options);
  const signed = await openpgp.sign({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
    detached: true
  });
  return {
    ...data,
    signature: {
      ...options,
      signatureValue: signed.signature
    }
  };
};

const verify = async ({ data, publicKey }) => {
  const verifyData = await createVerifyData(data, data.signature);
  const verified = await openpgp.verify({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(
      data.signature.signatureValue
    ), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys // for verification
  });
  const validity = verified.signatures[0].valid; // true
  return validity;
};

module.exports = {
  sign,
  verify
};
