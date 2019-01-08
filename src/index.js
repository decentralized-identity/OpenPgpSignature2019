const openpgp = require("openpgp");
const crypto = require("crypto");

const { createVerifyData } = require("./common");

const sign = async ({
  data,
  privateKey,
  creator,
  created,
  domain,
  signatureAttribute
}) => {
  if (!creator) {
    throw new Error("creator is required.");
  }

  if (!signatureAttribute) {
    signatureAttribute = "signature";
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
  const verifyData = await createVerifyData(data, options, signatureAttribute);
  const signed = await openpgp.sign({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
    detached: true
  });
  return {
    ...data,
    [signatureAttribute]: {
      ...options,
      signatureValue: signed.signature
    }
  };
};

const verify = async ({ data, publicKey, signatureAttribute }) => {
  if (!signatureAttribute) {
    signatureAttribute = "signature";
  }

  const verifyData = await createVerifyData(
    data,
    data[signatureAttribute],
    signatureAttribute
  );
  const verified = await openpgp.verify({
    message: openpgp.cleartext.fromText(verifyData), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(
      data[signatureAttribute].signatureValue
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
