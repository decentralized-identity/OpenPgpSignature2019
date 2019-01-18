const fixtures = require("../../../__tests__/__fixtures__");
const openpgp = require("openpgp");

const { compact, expand } = require("../index");

describe("encoding", () => {
  it("can compact and expand", async () => {
    const data = "hello";
    const signature = `
-----BEGIN PGP SIGNATURE-----
Version: OpenPGP.js v4.4.3
Comment: https://openpgpjs.org

wl4EARMIAAYFAlw6FvYACgkQSnoBzSruDWAoRgD+PfXv6dIJu5ddK3+aSKOT
68DvNEbLLF2HkG8OUAzbmBIBAIsrRXha4JhbhCdKggCjA+VxpYWDWLLR6kME
vM6Y9pv0
=kFtI
-----END PGP SIGNATURE-----
    `;

    const compacted = compact(signature);
    const expanded = expand(compacted);

    const verified = await openpgp.verify({
      message: openpgp.cleartext.fromText(data), // CleartextMessage or Message object
      signature: await openpgp.signature.readArmored(expanded), // parse detached signature
      publicKeys: (await openpgp.key.readArmored(
        fixtures.keypairs.secp256k1.publicKey
      )).keys // for verification
    });
    const validity = verified.signatures[0].valid; // true
    expect(validity).toBe(true);
  });

  it("idempotent", async () => {
    const data = "hello";
    const signature = `
-----BEGIN PGP SIGNATURE-----
Version: OpenPGP.js v4.4.3
Comment: https://openpgpjs.org

wl4EARMIAAYFAlw6FvYACgkQSnoBzSruDWAoRgD+PfXv6dIJu5ddK3+aSKOT
68DvNEbLLF2HkG8OUAzbmBIBAIsrRXha4JhbhCdKggCjA+VxpYWDWLLR6kME
vM6Y9pv0
=kFtI
-----END PGP SIGNATURE-----
    `;

    const expanded = expand(signature);

    expect(expanded).toBe(signature);

    const compacted = compact(signature);
    const compacted2 = compact(compacted);

    expect(compacted2).toBe(compacted);
  });
});
