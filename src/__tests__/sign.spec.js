const { documentLoader, documents, dids } = require("./__fixtures__");

const sign = require("../sign");

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
});
