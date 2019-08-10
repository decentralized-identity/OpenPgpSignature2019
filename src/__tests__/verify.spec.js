const { documentLoader, documents } = require("./__fixtures__");

jest.setTimeout(30 * 1000);

const verify = require("../verify");

describe("verify", () => {
  it("succeeds when signature is verifiable with documentLoader", async () => {
    const verified = await verify({
      data: documents.customContextSigned,
      options: {
        documentLoader
      }
    });
    expect(verified).toBe(true);
  });

  it("fails when signature is verifiable with documentLoader", async () => {
    expect.assertions(1);
    try {
      await verify({
        data: documents.customContextSignedBroken,
        options: {
          documentLoader
        }
      });
    } catch (e) {
      expect(e.message).toBe(
        "Could not resole: did:example:123-not-resolveable#key-0"
      );
    }
  });
});
