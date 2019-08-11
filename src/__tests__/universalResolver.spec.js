const resolver = require("../universalResolver");

describe("universalResolver", () => {
  it("supports btcr", async () => {
    const didUri = "did:btcr:xxcl-lzpq-q83a-0d5#yubikey";
    const doc = await resolver.resolve(didUri);
    expect(doc.id).toBe("did:btcr:xxcl-lzpq-q83a-0d5");
  });
});
