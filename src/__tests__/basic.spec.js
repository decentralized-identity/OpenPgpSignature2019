const fixtures = require("./__fixtures__");
const openpgp = require("openpgp");

const { compact, expand } = require("../encoding");

describe("openpgp", () => {
  it("should support key generation, sign and verify", async () => {
    expect.assertions(3);
    const keypair = await openpgp.generateKey({
      userIds: [
        {
          name: fixtures.email
        }
      ],
      curve: "secp256k1",
      passphrase: fixtures.passphrase
    });
    expect(keypair).toBeDefined();
    const privKeyObj = (await openpgp.key.readArmored(
      keypair.privateKeyArmored
    )).keys[0];
    await privKeyObj.decrypt(fixtures.passphrase);
    const data = "hello";
    const signed = await openpgp.sign({
      message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
      privateKeys: [privKeyObj], // for signing
      detached: true
    });
    expect(signed.signature).toBeDefined();
    const verified = await openpgp.verify({
      message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
      signature: await openpgp.signature.readArmored(signed.signature), // parse detached signature
      publicKeys: (await openpgp.key.readArmored(keypair.publicKeyArmored)).keys // for verification
    });
    const validity = verified.signatures[0].valid; // true
    expect(validity).toBe(true);
  });
});
