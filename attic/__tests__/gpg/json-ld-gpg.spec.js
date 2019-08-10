const jsonld = require("jsonld");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const nodeDocumentLoader = jsonld.documentLoaders.node();
const openpgp = require("openpgp");
const OpenPgpSignature2019 = require("../../index");

jest.setTimeout(20 * 1000);

const publicKeyPgp = fs
  .readFileSync(path.resolve(__dirname, "./publicKey.asc"))
  .toString();

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

    const pathToFile = path.resolve(__dirname, "verifyDataHexString.txt");
    const pathToSig = path.resolve(__dirname, "verifyDataHexString.txt.gpg");
    const cmd = `
    echo "${verifyDataHexString}" > ${pathToFile}
    cat ${pathToFile} | gpg --detach-sign --armor -u 3AF00854CF8D9237 > ${pathToSig}
  `;

    const existingResult = shell.exec(cmd, { silent: true });
    // console.log(existingResult);

    const signatureValue = fs.readFileSync(pathToSig).toString();

    const signed = {
      ...framed,
      proof: {
        ...proof,
        signatureValue
      }
    };

    // console.log(signed);

    const cmd2 = `
    gpg --verify --armor ${pathToSig} ${pathToFile}
    `;
    const existingResult2 = shell.exec(cmd2, { silent: true });

    // console.log(existingResult2.stderr);
    // console.log(signatureValue);

    const verified = await openpgp.verify({
      message: openpgp.message.fromBinary(
        Buffer.from(verifyDataHexString + "\n")
      ), // CleartextMessage or Message object
      signature: await openpgp.signature.readArmored(
        signed.proof.signatureValue
      ), // parse detached signature
      publicKeys: (await openpgp.key.readArmored(publicKeyPgp)).keys // for verification
    });
    expect(verified.signatures[0].valid).toBe(true);

    const verified2 = await OpenPgpSignature2019.verify({
      data: signed,
      options: {
        compact: false,
        documentLoader: customLoader
      }
    });

    expect(verified2).toBe(true);
  });
});
