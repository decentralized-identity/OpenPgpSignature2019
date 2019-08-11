const fetch = require("node-fetch");

const getJson = async url =>
  fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  }).then(data => data.json());

const normalizeDocument = res => {
  const didDoc = { ...res.didDocument };
  didDoc.publicKey = res.methodMetadata.continuation.publicKey;
  return didDoc;
};

// const getPublicKeyFromVerificationMethod = async verificationMethod => {
//   const res = await getJson(
//     "https://uniresolver.io/1.0/identifiers/" + verificationMethod
//   );
//   const publicKeyFromResolver = res.methodMetadata.continuation.publicKey.find(
//     k => {
//       return k.id === verificationMethod;
//     }
//   );
//   return publicKeyFromResolver;
// };

module.exports = {
  resolve: async didUri => {
    const res = await getJson(
      "https://uniresolver.io/1.0/identifiers/" + didUri
    );
    const doc = await normalizeDocument(res);
    return doc;
  }
};
