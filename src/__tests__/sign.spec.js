const openpgp = require("openpgp");

const { documentLoader, documents, dids } = require("./__fixtures__");

const sign = require("../sign");

jest.setTimeout(30 * 1000);

describe("sign", () => {
  it("with passphrase, not compact", async () => {
    const credential = await sign({
      data: documents.customContext,
      privateKey: dids["did:example:123"].keys.key1.privateKey,
      proof: {
        verificationMethod: "did:example:123#key-1",
        proofPurpose: "assertionMethod",
        type: "OpenPgpSignature2019",
        created: "2019-08-10T03:01:04.700Z"
      },
      options: {
        documentLoader: documentLoader,
        passphrase: "correct horse battery staple"
      }
    });
    expect(credential["@context"]).toBe("https://w3id.org/security/v2");
    expect(credential["coolCustomContext:myCustomProperty1337"]).toBe(
      "deadbeef"
    );
    expect(credential.proof.type).toBe("OpenPgpSignature2019");
    expect(credential.proof.created).toBe("2019-08-10T03:01:04.700Z");
    expect(credential.proof.proofPurpose).toBe("assertionMethod");
    expect(credential.proof.verificationMethod).toBe("did:example:123#key-1");
    expect(credential.proof.signatureValue).toBeDefined();
    // console.log(JSON.stringify(credential, null, 2));
  });

  it("will add created in ommited", async () => {
    const credential = await sign({
      data: documents.customContext,
      privateKey: dids["did:example:123"].keys.key1.privateKey,
      proof: {
        verificationMethod: "did:example:123#key-1",
        proofPurpose: "assertionMethod",
        type: "OpenPgpSignature2019"
      },
      options: {
        documentLoader: documentLoader,
        passphrase: "correct horse battery staple"
      }
    });
    expect(credential["@context"]).toBe("https://w3id.org/security/v2");
    expect(credential["coolCustomContext:myCustomProperty1337"]).toBe(
      "deadbeef"
    );
    expect(credential.proof.type).toBe("OpenPgpSignature2019");
    expect(credential.proof.created).toBeDefined();
  });

  it("supports openpgp.js key objects", async () => {
    expect.assertions(1);
    const privateKey = dids["did:example:123"].keys.key1.privateKey;
    const privateKeyObject = (await openpgp.key.readArmored(privateKey))
      .keys[0];
    await privateKeyObject.decrypt("correct horse battery staple");
    const credential = await sign({
      data: documents.customContext,
      privateKey: privateKeyObject,
      proof: {
        verificationMethod: "did:example:123#key-1",
        proofPurpose: "assertionMethod",
        type: "OpenPgpSignature2019",
        created: "2019-08-10T03:01:04.700Z"
      },
      options: {
        documentLoader: documentLoader
      }
    });
    expect(credential.proof.type).toBe("OpenPgpSignature2019");
  });

  it("throws when passphrase is required and not provided", async () => {
    expect.assertions(1);
    try {
      await sign({
        data: documents.customContext,
        privateKey: dids["did:example:123"].keys.key1.privateKey,
        proof: {
          verificationMethod: "did:example:123#key-1",
          proofPurpose: "assertionMethod",
          type: "OpenPgpSignature2019",
          created: "2019-08-10T03:01:04.700Z"
        },
        options: {
          documentLoader: documentLoader
          // passphrase: "correct horse battery staple"
        }
      });
    } catch (e) {
      expect(e.message).toBe("passphrase is required in signature options.");
    }
  });

  it("throws when verificationMethod is missing", async () => {
    expect.assertions(1);
    try {
      await sign({
        data: documents.customContext,
        privateKey: dids["did:example:123"].keys.key1.privateKey,
        proof: {
          // verificationMethod: "did:example:123#key-1",
          proofPurpose: "assertionMethod",
          type: "OpenPgpSignature2019",
          created: "2019-08-10T03:01:04.700Z"
        },
        options: {
          documentLoader: documentLoader,
          passphrase: "correct horse battery staple"
        }
      });
    } catch (e) {
      expect(e.message).toBe("proof.verificationMethod is required");
    }
  });
});
