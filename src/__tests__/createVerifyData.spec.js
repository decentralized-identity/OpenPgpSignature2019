const { documentLoader, documents } = require("./__fixtures__");

const createVerifyData = require("../createVerifyData");

// JSON-LD url resolution is slow.
jest.setTimeout(20 * 1000);

describe("createVerifyData", () => {
  it("it produces framed and hex", async () => {
    const proof = {
      verificationMethod: "did:example:123#kid=456",
      proofPurpose: "assertionMethod",
      type: "OpenPgpSignature2019",
      documentLoader: documentLoader,
      created: "2019-08-10T03:01:04.700Z"
    };
    const { framed, verifyDataHexString } = await createVerifyData(
      documents.customContext,
      proof
    );
    expect(framed).toEqual({
      "@context": "https://w3id.org/security/v2",
      "coolCustomContext:myCustomProperty1337": "deadbeef"
    });
    expect(verifyDataHexString).toBe(
      "f110f5d16c438e4ad403f17813bacf375240e761a39e7acb2527691c6382ecdb73c85c92a51e6413c882b0d176840d23ab23e441310dac78fb4645fb77b19966"
    );
  });
});
