const jsonld = require("jsonld");
const shell = require("shelljs");
const nodeDocumentLoader = jsonld.documentLoaders.node();
const OpenPgpSignature2019 = require("../index");

jest.setTimeout(10 * 1000);

const publicKeyPgp = `
-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: GPGTools - https://gpgtools.org

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
rnFu2qXfCsLkrR23CVvbYS8=
=q3UE
-----END PGP PUBLIC KEY BLOCK-----`.trim();

const data = {
  "@context": "https://example.com/coolCustomContext/v1",
  myCustomProperty1337: "deadbeef"
};

const publicKeyObject = {
  "@context": "https://w3id.org/security/v2",
  type: "OpenPgpVerificationKey2019",
  id: "did:example:123#kid=456",
  controller: "did:example:123",
  publicKeyPgp
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

describe("yubikey", () => {
  it("can sign with gpg", async () => {
    const proof = {
      verificationMethod: "did:example:123#kid=456",
      proofPurpose: "assertionMethod",
      type: "OpenPgpSignature2019",
      documentLoader: customLoader,
      created: new Date().toISOString()
    };
    const {
      framed,
      verifyDataHexString
    } = await OpenPgpSignature2019.createVerifyData(data, proof);

    // console.log(verifyDataHexString);
    const cmd = `
    echo "${verifyDataHexString}" | gpg --detach-sign --armor -u 3AF00854CF8D9237
  `;

    const existingResult = shell.exec(cmd, { silent: true });
    console.log(existingResult.stdout);

    const signed = {
      ...framed,
      proof: {
        ...proof,
        signatureValue: existingResult.stdout
      }
    };

    console.log(signed);

    const message = signed.proof.signatureValue;
    const cmd2 = `
    echo "-----BEGIN PGP SIGNED MESSAGE-----\nHash: SHA1\n\n${verifyDataHexString}\n${message}" | gpg --verify --armor
   
  `;
    const existingResult2 = shell.exec(cmd2, { silent: true });
    console.log(existingResult2.stderr);

    const verified = await OpenPgpSignature2019.verify({
      data: signed,
      options: {
        compact: false,
        documentLoader: customLoader
      }
    });

    console.log(verified);
  });
});
