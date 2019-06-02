const fs = require("fs");
const path = require("path");
const jsonld = require("jsonld");
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
  id: "https://example.com/i/alice/keys/1",
  controller: "https://example.com/i/alice",
  publicKeyPgp
};

// define a mapping of context URL => context doc
const CONTEXTS = {
  "https://example.com/i/alice/keys/1": {
    ...publicKeyObject
  },
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

const customLoader = (url, callback) => {
  // console.log(url);
  if (url in CONTEXTS) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    });
  }
  return nodeDocumentLoader(url, callback);
};

jest.setTimeout(10 * 1000);

describe("custom loader", () => {
  it("can sign and verify data", async () => {
    const data = {
      "@context": "https://example.com/coolCustomContext/v1",
      myCustomProperty1337: "deadbeef"
    };

    let signedData = await OpenPgpSignature2019.sign({
      data,
      privateKey: privateKeyAsc,
      proof: {
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod"
      },
      options: {
        documentLoader: customLoader,
        passphrase: "correct horse battery staple",
        compact: true
      }
    });

    // const example = {
    //   "@context": "https://w3id.org/security/v2",
    //   "coolCustomContext:myCustomProperty1337": "deadbeef",
    //   proof: {
    //     verificationMethod: "https://example.com/i/alice/keys/1",
    //     proofPurpose: "assertionMethod",
    //     created: "2019-06-02T18:22:48.122Z",
    //     type: "OpenPgpSignature2019",
    //     signatureValue:
    //       "wl4EARMIAAYFAlz0E/oACgkQSnoBzSruDWBCwwEAw89YLtm4W/n81RSBRzINZ71ldNZosJgRGhTo8NpkHE0A/2KFax1bbOIe6EVM3O9CfiGOzQsOEwbp57/gTeEzizjD=XcrZ"
    //   }
    // };

    const verified = await OpenPgpSignature2019.verify({
      data: signedData,
      options: {
        documentLoader: customLoader
      }
    });

    expect(verified).toBe(true);
  });
});
