const openpgp = require("openpgp");

describe("openpgp", () => {
  it("should support key generation, sign and verify", async () => {
    expect.assertions(3);
    const keypair = await openpgp.generateKey({
      userIds: [
        {
          name: "bob@exmple.com"
        }
      ],
      curve: "secp256k1",
      passphrase: "correct horse battery staple"
    });
    expect(keypair).toBeDefined();
    const privKeyObj = (await openpgp.key.readArmored(
      keypair.privateKeyArmored
    )).keys[0];
    await privKeyObj.decrypt("correct horse battery staple");

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
