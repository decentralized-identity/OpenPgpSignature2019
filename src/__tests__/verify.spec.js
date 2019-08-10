const { documentLoader, documents } = require("./__fixtures__");

const verify = require("../verify");

describe("verify", () => {
  it("not compact", async () => {
    const verified = await verify({
      data: documents.customContextSigned,
      options: {
        compact: false,
        documentLoader
      }
    });
    expect(verified).toBe(true);
  });
});
