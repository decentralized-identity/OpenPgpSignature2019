
const createVerifyData = require("./createVerifyData");

const suite = require("./suite");

const sign = async ({ data, privateKey, signatureOptions, options }) => {
  const { framed, verifyDataHexString } = await createVerifyData(
    data,
    signatureOptions
  );

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
      ...signatureOptions,
      signatureValue: signatureValue
    }
  };
};

const verify = async ({ data, publicKey }) => {
  const { verifyDataHexString } = await createVerifyData(data, data.proof);
  return suite.verify({
    verifyData: verifyDataHexString,
    signature: data.proof.signatureValue,
    publicKey
  });
};

module.exports = {
  sign,
  verify
};
