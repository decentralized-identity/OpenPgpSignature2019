const jsonld = require("jsonld");
const nodeDocumentLoader = jsonld.documentLoaders.node();

const OpenPgpSignature2019 = require("../index");

jest.setTimeout(10 * 1000);

const doc = {
  "@context": {
    schema: "http://schema.org/",
    name: "schema:name",
    homepage: "schema:url",
    image: "schema:image"
  },
  name: "Manu Sporny",
  homepage: "https://manu.sporny.org/",
  image: "https://manu.sporny.org/images/manu.png"
};

describe("generate sign verify without dids", () => {
  it("works as expected", async () => {
    const keys = await OpenPgpSignature2019.generateKey({
      userIds: [
        {
          name: "anon@example.com"
        }
      ],
      curve: "secp256k1"
    });
    const contexts = {
      "https://example.com/i/alice/keys/1": {
        "@context": "https://w3id.org/security/v2",
        type: "OpenPgpVerificationKey2019",
        id: "https://example.com/i/alice/keys/1",
        controller: "https://example.com/i/alice",
        publicKeyPgp: keys.publicKey
      }
    };
    let signedData = await OpenPgpSignature2019.sign({
      data: doc,
      privateKey: keys.privateKey,
      proof: {
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod"
      }
    });
    const customLoader = (url, callback) => {
      if (url in contexts) {
        return callback(null, {
          contextUrl: null, // this is for a context via a link header
          document: contexts[url], // this is the actual document that was loaded
          documentUrl: url // this is the actual context URL after redirects
        });
      }
      return nodeDocumentLoader(url, callback);
    };
    const verified = await OpenPgpSignature2019.verify({
      data: signedData,
      options: {
        documentLoader: customLoader
      }
    });
    expect(verified).toBe(true);
  });
});
