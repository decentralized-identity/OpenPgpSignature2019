const {
  documentLoader,
  documentExample,
  dids,
  credentials
} = require("./__fixtures__");

const verify = require("../verify");

describe("verify", () => {
  it("not compact", async () => {
    const verified = await verify({
      data: credentials.credential,
      options: {
        compact: false,
        documentLoader
      }
    });

    expect(verified).toBe(true);
  });
});
