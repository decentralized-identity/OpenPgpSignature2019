const OpenPgpSignature2019 = require("../index");

const keys = {
  publicKey:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRIiYW5vbkBl\r\neGFtcGxlLmNvbSLCdwQQEwgAHwUCXPQjDgYLCQcIAwIEFQgKAgMWAgECGQEC\r\nGwMCHgEACgkQOqx3TfQyHavsPAEA7Ah6P2cs9B/72bfMiWgeBcEOTIIBjaQ+\r\nHycfG5ldmpQBAP30Tqo0yuwiaf/qDOLnzrXPQIyz1noKdYpXgGOpzivWzlME\r\nXPQjDhIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBg\r\nRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB8JhBBgTCAAJ\r\nBQJc9CMOAhsMAAoJEDqsd030Mh2re2cA/jr04uWORrq1rXnfGWUeg3uSc0Dw\r\nhzSqweh/a64RHkUvAP0d6whaffpbnb2pnlivCraq+EyBPuDrJFXRpFMA7v6N\r\nQw==\r\n=kUuh\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
  privateKey:
    "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxXQEXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAAEAtt9uYl73\r\noEnh1lAB1SqGxc1o1c6C4lx4myXH3P+WRD4SgM0SImFub25AZXhhbXBsZS5j\r\nb20iwncEEBMIAB8FAlz0Iw4GCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJ\r\nEDqsd030Mh2r7DwBAOwIej9nLPQf+9m3zIloHgXBDkyCAY2kPh8nHxuZXZqU\r\nAQD99E6qNMrsImn/6gzi5861z0CMs9Z6CnWKV4Bjqc4r1sd4BFz0Iw4SBSuB\r\nBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMgYEQxYQeunmpt\r\nCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAcAAQC2325iXvegSeHWUAHV\r\nKobFzWjVzoLiXHibJcfc/5ZEPhKAwmEEGBMIAAkFAlz0Iw4CGwwACgkQOqx3\r\nTfQyHat7ZwD+OvTi5Y5GurWted8ZZR6De5JzQPCHNKrB6H9rrhEeRS8A/R3r\r\nCFp9+ludvameWK8Ktqr4TIE+4OskVdGkUwDu/o1D\r\n=EnRP\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n",
  revocationCertificate:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\nComment: This is a revocation certificate\r\n\r\nwmEEIBMIAAkFAlz0Iw4CHQAACgkQOqx3TfQyHavq6gEAziFfOR1SeAzJd9LW\r\nm7EqSmYtJA+3c2Am8hyUnYTF92oBAOKcWz/h2UbTDJnqXSRa9j1MzRilhQKs\r\n8Bo+tH1N3smt\r\n=RDKz\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
};

const doc = {
  "@context": {
    schema: "http://schema.org/",
    name: "schema:name",
    homepage: "schema:url",
    image: "schema:image"
  },
  name: "Manu Sporny",
  homepage: "https://manu.sporny.org/",
  image: "https://manu.sporny.org/images/manu.png"
};

jest.setTimeout(10 * 1000);

describe("compact options", () => {
  it("default is not compact", async () => {
    let signedData = await OpenPgpSignature2019.sign({
      data: doc,
      privateKey: keys.privateKey,
      proof: {
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod"
      }
    });

    // console.log(signedData.proof.signatureValue)

    expect(
      signedData.proof.signatureValue.indexOf("-----BEGIN PGP SIGNATURE-----")
    ).toBe(0);
  });
  it("can be compacted", async () => {
    let signedData = await OpenPgpSignature2019.sign({
      data: doc,
      privateKey: keys.privateKey,
      proof: {
        verificationMethod: "https://example.com/i/alice/keys/1",
        proofPurpose: "assertionMethod"
      },
      options: {
        compact: true
      }
    });

    expect(
      signedData.proof.signatureValue.indexOf("-----BEGIN PGP SIGNATURE-----")
    ).toBe(-1);
  });
});
