const fs = require("fs");
const path = require("path");
const jsonld = require("jsonld");
const url = require("url");
const nodeDocumentLoader = jsonld.documentLoaders.node();

const OpenPgpSignature2019 = require("../index");

const publicKeyPgp = fs
  .readFileSync(path.resolve(__dirname, "./publicKey.asc"))
  .toString();

const privateKeyAsc = fs
  .readFileSync(path.resolve(__dirname, "./privateKey.asc"))
  .toString();

const publicKeyObject = {
  "@context": "https://w3id.org/security/v2",
  type: "OpenPgpVerificationKey2019",
  id: "did:example:123#kid=456",
  controller: "did:example:123",
  publicKeyPgp
};

// define a mapping of context URL => context doc
const CONTEXTS = {
  "https://example.com/coolCustomContext/v1": {
    "@context": {
      "@version": 1.1,
      id: "@id",
      type: "@type",
      dc: "http://purl.org/dc/terms/",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      schema: "http://schema.org/",
      myCustomProperty1337: "coolCustomContext:myCustomProperty1337"
    }
  }
};

const resolver = {
  resolve: did => {
    return {
      "@context": "https://w3id.org/did/v1",
      id: did,
      publicKey: [publicKeyObject],
      service: [
        {
          // used to retrieve Verifiable Credentials associated with the DID
          type: "VerifiableCredentialService",
          serviceEndpoint: "https://example.com/vc/"
        }
      ]
    };
  }
};

const customLoader = (url, callback) => {
  // are we handling a DID?
  if (url.indexOf("did:example") === 0) {
    const doc = resolver.resolve(url);
    // iterate public keys, find the correct id...
    for (publicKey of doc.publicKey) {
      if (publicKey.id === url) {
        return callback(null, {
          contextUrl: null, // this is for a context via a link header
          document: publicKey, // this is the actual document that was loaded
          documentUrl: url // this is the actual context URL after redirects
        });
      }
    }
  }

  //   are we handling a custom context?
  if (url in CONTEXTS) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    });
  }

  //   is this a published (public) context?
  return nodeDocumentLoader(url, callback);
};

jest.setTimeout(20 * 1000);

describe("works with dids", () => {
  it("can sign and verify data", async () => {
    const data = {
      "@context": "https://example.com/coolCustomContext/v1",
      myCustomProperty1337: "deadbeef"
    };

    let signedData = await OpenPgpSignature2019.sign({
      data,
      privateKey: privateKeyAsc,
      proof: {
        verificationMethod: "did:example:123#kid=456",
        proofPurpose: "assertionMethod"
      },
      options: {
        documentLoader: customLoader,
        passphrase: "correct horse battery staple",
        compact: true
      }
    });

    const verified = await OpenPgpSignature2019.verify({
      data: signedData,
      options: {
        documentLoader: customLoader
      }
    });

    expect(verified).toBe(true);
  });
});
