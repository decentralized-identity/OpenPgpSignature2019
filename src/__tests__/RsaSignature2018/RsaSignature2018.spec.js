const fs = require("fs");
const path = require("path");
const jsigs = require("jsonld-signatures");
const { RsaSignature2018 } = jsigs.suites;
const { AssertionProofPurpose } = jsigs.purposes;
const { RSAKeyPair } = require("crypto-ld");
const jsonld = require("jsonld");
const { documentLoaders } = jsonld;
const { node: documentLoader } = documentLoaders;

const publicKeyPem = fs
  .readFileSync(path.resolve(__dirname, "./publicKey.pem"))
  .toString();
const privateKeyPem = fs
  .readFileSync(path.resolve(__dirname, "./privateKey.pem"))
  .toString();

const publicKeyObject = {
  "@context": "https://w3id.org/security/v2",
  type: "RsaVerificationKey2018",
  id: "https://example.com/i/alice/keys/1",
  controller: "https://example.com/i/alice",
  publicKeyPem
};

const controllerObject = {
  "@context": "https://w3id.org/security/v2",
  id: "https://example.com/i/alice",
  publicKey: [publicKeyObject],
  // this authorizes this key to be used for making assertions
  assertionMethod: [publicKeyObject.id]
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

const customLoader = url => {
  if (url in CONTEXTS) {
    // console.log(url);
    return {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }
};

describe("RsaSignature2018", () => {
  it("can sign and verify data", async () => {
    const data = {
      "@context": "https://example.com/coolCustomContext/v1",
      myCustomProperty1337: "deadbeef"
    };
    const key = new RSAKeyPair({ ...publicKeyObject, privateKeyPem });

    const signed = await jsigs.sign(data, {
      documentLoader: customLoader,
      compactProof: false,
      suite: new RsaSignature2018({ key }),
      purpose: new AssertionProofPurpose()
    });

    const signedData = {
      "@context": "https://example.com/coolCustomContext/v1",
      myCustomProperty1337: "deadbeef",
      proof: {
        type: "RsaSignature2018",
        created: "2019-06-02T16:57:51Z",
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod",
        jws:
          "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..WA0d-U17hI2HrIi3NpyKYzY-DbXxqKpdHTxI_jvlB3eTvYOppbB7MIaVFVkdbmbaJUsskPZqDUtCY6SG97zqYxc_WCs1G954i_e8SEoa5Fa8N1ONrucb0NglAbCXDZ8UN-jXU7p6Kr9zCGcGYQhA6wuK8OGyPRQW7fE6TkTcC348KiDxjujlN-6De7086Ku4eDbSjgHdsR2NDHIRD-wThm6D5QbhkkVxnfk98NLjTQhQk9gorQh7IiAN0KaTYnbIfJEYeGBzykn8qbnIRaZhsID1icN1cPny9SJN-fm9BhzZftUvfaiqOo98gH3daCVVzcPdadEOUlxflTDDAJQRLg"
      }
    };

    const result = await jsigs.verify(signedData, {
      documentLoader: customLoader,
      suite: new RsaSignature2018(key),
      purpose: new AssertionProofPurpose({ controller: controllerObject })
    });

    expect(result.verified);
  });
});
