const jsonld = require("jsonld");
const crypto = require("crypto");

const canonize = async data => {
  return jsonld.canonize(data);
};

const sha256 = data => {
  const h = crypto.createHash("sha256");
  h.update(data);
  return h.digest("hex");
};

const cannonizeSignatureOptions = signatureOptions => {
  let _signatureOptions = {
    "@context": "https://w3id.org/security/v2",
    created: signatureOptions.created,
    proofPurpose: signatureOptions.proofPurpose,
    verificationMethod: signatureOptions.verificationMethod
  };
  return canonize(_signatureOptions);
};

const cannonizeDocument = doc => {
  let _doc = { ...doc };
  delete _doc["proof"];
  return canonize(_doc);
};

const createVerifyData = async (data, signatureOptions) => {
  const documentLoader = signatureOptions.documentLoader
    ? signatureOptions.documentLoader
    : jsonld.documentLoader;

  const [expanded] = await jsonld.expand(data, { documentLoader });

  const framed = await jsonld.compact(
    expanded,
    "https://w3id.org/security/v2",
    { skipExpansion: true }
  );

  const cannonizedSignatureOptions = await cannonizeSignatureOptions(
    signatureOptions
  );
  const hashOfCannonizedSignatureOptions = sha256(cannonizedSignatureOptions);
  const cannonizedDocument = await cannonizeDocument(framed);
  const hashOfCannonizedDocument = sha256(cannonizedDocument);

  return {
    framed,
    verifyDataHexString:
      hashOfCannonizedSignatureOptions + hashOfCannonizedDocument
  };
};

module.exports = createVerifyData;
