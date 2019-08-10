const createVerifyData = require("./createVerifyData");
const openpgp = require("openpgp");
const encoding = require("./encoding");

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

  // console.log(verifyDataHexString);

  const armoredSignature =
    data.proof.signatureValue.indexOf("PGP SIGNATURE") === -1
      ? encoding.expand(data.proof.signatureValue)
      : data.proof.signatureValue;

  const verified = await openpgp.verify({
    message: openpgp.message.fromBinary(
      Buffer.from(verifyDataHexString + "\n")
    ), // CleartextMessage or Message object
    signature: await openpgp.signature.readArmored(armoredSignature), // parse detached signature
    publicKeys: (await openpgp.key.readArmored(publicKey)).keys // for verification
  });

  return verified.signatures[0].valid === true; // true
};

module.exports = verify;
