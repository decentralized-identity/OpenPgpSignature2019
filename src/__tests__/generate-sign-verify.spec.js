const jsonld = require("jsonld");
const nodeDocumentLoader = jsonld.documentLoaders.node();

const OpenPgpSignature2019 = require("../index");

jest.setTimeout(10 * 1000);

describe("generate sign verify", () => {
  it("can generate sign and verify", async () => {
    const keys = await OpenPgpSignature2019.generateKey({
      userIds: [
        {
          name: "anon@example.com"
        }
      ],
      curve: "secp256k1"
    });

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

    let signedData = await OpenPgpSignature2019.sign({
      data: doc,
      privateKey: keys.privateKey,
      proof: {
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod"
      }
    });

    const publicKeyObject = {
      "@context": "https://w3id.org/security/v2",
      type: "OpenPgpVerificationKey2019",
      id: "https://example.com/i/alice/keys/1",
      controller: "https://example.com/i/alice",
      publicKeyAsc: keys.publicKey
    };

    // define a mapping of context URL => context doc
    const CONTEXTS = {
      "https://example.com/i/alice/keys/1": {
        ...publicKeyObject
      }
    };

    const customLoader = (url, callback) => {
      if (url in CONTEXTS) {
        return callback(null, {
          contextUrl: null, // this is for a context via a link header
          document: CONTEXTS[url], // this is the actual document that was loaded
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
