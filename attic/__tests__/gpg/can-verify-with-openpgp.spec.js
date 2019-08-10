const openpgp = require("openpgp");
const fs = require("fs");
const path = require("path");

const publicKeyPgp = fs
  .readFileSync(path.resolve(__dirname, "./publicKey.asc"))
  .toString("utf8");

const message = fs
  .readFileSync(path.resolve(__dirname, "./signed.gpg"))
  .toString("utf8");

const verifyData = fs
  .readFileSync(path.resolve(__dirname, "./file.txt"))
  .toString("utf8");

describe("Can import GPG Detached Signature and Keys", () => {
  it("and verify with OpenPGP.js", async () => {
    const verified = await openpgp.verify({
      message: openpgp.message.fromBinary(Buffer.from(verifyData)), // CleartextMessage or Message object
      signature: await openpgp.signature.readArmored(message), // parse detached signature
      publicKeys: (await openpgp.key.readArmored(publicKeyPgp)).keys // for verification
    });
    expect(verified.signatures[0].valid).toBe(true);
  });
});
