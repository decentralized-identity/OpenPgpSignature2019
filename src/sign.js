const createVerifyData = require("./createVerifyData");
const suite = require("./suite");

const sign = async ({ data, privateKey, proof, options }) => {
  if (!proof.verificationMethod) {
    throw new Error("proof.verificationMethod is required");
  }
  if (!proof.created) {
    proof.created = new Date().toISOString();
  }

  const signatureOptions = {
    ...proof,
    ...options
  };

  proof.type = "OpenPgpSignature2019";

  const result = await createVerifyData(data, signatureOptions);

  const { framed, verifyDataHexString } = result;

  const signatureValue = await suite.sign({
    verifyData: verifyDataHexString,
    privateKey,
    options: options || {
      compact: false
    }
  });

  return {
    ...framed,
    proof: {
      ...proof,
      signatureValue: signatureValue
    }
  };
};

module.exports = sign;
