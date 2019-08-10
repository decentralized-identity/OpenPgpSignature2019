const createVerifyData = require("./createVerifyData");
const suite = require("./suite");

const resolvePublicKey = async (documentLoader, verificationMethod) => {
  const result = await new Promise((resolve, reject) => {
    documentLoader(verificationMethod, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
  return result.document.publicKeyPgp;
};

const verify = async ({ data, options }) => {
  const signatureOptions = {
    ...data.proof,
    ...options
  };
  const { verifyDataHexString } = await createVerifyData(
    data,
    signatureOptions
  );

  const documentLoader = signatureOptions.documentLoader
    ? signatureOptions.documentLoader
    : jsonld.documentLoader;

  const publicKey = await resolvePublicKey(
    documentLoader,
    data.proof.verificationMethod
  );

  return suite.verify({
    verifyData: verifyDataHexString,
    signature: data.proof.signatureValue,
    publicKey
  });
};

module.exports = verify;
