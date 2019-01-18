const fixtures = require("./__fixtures__");
const openpgp = require("openpgp");
const { sign, verify } = require("../index");

describe("OpenPgpSignature2019", () => {
  let privateKey;
  beforeAll(async () => {
    privateKey = (await openpgp.key.readArmored(
      fixtures.keypairs.secp256k1.privateKey
    )).keys[0];
    await privateKey.decrypt(fixtures.passphrase);
  });
  it(
    "should support sign and verify of linked data",
    async () => {
      expect.assertions(3);

      const signed = await sign({
        data: fixtures.linkedData,
        privateKey,
        signatureOptions: {
          creator: "did:example:123",
          domain: "example.com"
        }
      });
      // console.log(JSON.stringify(signed, null, 2));
      expect(signed.proof.creator).toBe("did:example:123");
      expect(signed.proof.domain).toBe("example.com");
      const verified = await verify({
        data: signed,
        publicKey: fixtures.keypairs.secp256k1.publicKey
      });
      expect(verified).toBe(true);
    },
    10 * 1000
  );

  it("creator is required to create signature", async () => {
    expect.assertions(1);

    try {
      await sign({
        data: fixtures.linkedData,
        signatureOptions: {},
        privateKey: "who cares, no creator"
      });
    } catch (e) {
      expect(e.message).toBe("signatureOptions.verificationMethod is required");
    }
  });

  it(
    "can use compact signatures (PGP headers removed)",
    async () => {
      expect.assertions(2);

      const signed = await sign({
        data: fixtures.linkedData,
        signatureOptions: {
          creator: "did:example:123"
        },
        options: {
          compact: true
        },
        privateKey
      });
      expect(signed.proof.signatureValue.indexOf("PGP SIGNATURE")).toBe(-1);
      const verified = await verify({
        data: signed,
        publicKey: fixtures.keypairs.secp256k1.publicKey
      });
      expect(verified).toBe(true);
    },
    10 * 1000
  );
});
