const openpgp = require("openpgp");

const { sign, verify } = require("../index");

jest.setTimeout(20 * 1000);

describe("SignAndVerify", () => {
  const key = {
    publicKey:
      "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXNcLSxMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRdhbm9uIDxh\r\nbm9uQGV4YW1wbGUuY29tPsJ3BBATCAAfBQJc1wtLBgsJBwgDAgQVCAoCAxYC\r\nAQIZAQIbAwIeAQAKCRDOC06kQzKHaZlqAQDY2zqfCiJH2Akcv0lo+1fGP5V+\r\nI2YVSbWmUuqnCtsXdgEA0nhvtNghJSDrq+3Qzu05cN2/r6H+Hn4KgDqtxz0P\r\n49fOUwRc1wtLEgUrgQQACgIDBDbYm4os7DRESOAfco+V2+lAvI9t687qd3++\r\nz+FTIGBEMWEHrp5qbQqDQr9sWyl3sSoFB/myDgyO1baD5SUw24ADAQgHwmEE\r\nGBMIAAkFAlzXC0sCGwwACgkQzgtOpEMyh2lNvQD+IFYq+gKQB7d9CNjEqvOQ\r\nZnn1nPhuMaydpxmv5+s/m5YBAMlQmgQ5ulfPSD5OBrJVbiF2TSBmlcWVAD6R\r\no41Q/H1Y\r\n=PfgI\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
    privateKey:
      "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\n\r\nxXQEXNcLSxMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAAEAtt9uYl73\r\noEnh1lAB1SqGxc1o1c6C4lx4myXH3P+WRD4SgM0XYW5vbiA8YW5vbkBleGFt\r\ncGxlLmNvbT7CdwQQEwgAHwUCXNcLSwYLCQcIAwIEFQgKAgMWAgECGQECGwMC\r\nHgEACgkQzgtOpEMyh2mZagEA2Ns6nwoiR9gJHL9JaPtXxj+VfiNmFUm1plLq\r\npwrbF3YBANJ4b7TYISUg66vt0M7tOXDdv6+h/h5+CoA6rcc9D+PXx3gEXNcL\r\nSxIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBgRDFh\r\nB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIBwABALbfbmJe96BJ\r\n4dZQAdUqhsXNaNXOguJceJslx9z/lkQ+EoDCYQQYEwgACQUCXNcLSwIbDAAK\r\nCRDOC06kQzKHaU29AP4gVir6ApAHt30I2MSq85BmefWc+G4xrJ2nGa/n6z+b\r\nlgEAyVCaBDm6V89IPk4GslVuIXZNIGaVxZUAPpGjjVD8fVg=\r\n=1jGv\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n",
    revocationCertificate:
      "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.7\r\nComment: https://openpgpjs.org\r\nComment: This is a revocation certificate\r\n\r\nwmEEIBMIAAkFAlzXC0sCHQAACgkQzgtOpEMyh2l39AEAqpcJQ2N5heHruMki\r\nBOwoXLLLd+UdbxqlVBG7Th5L/dQBAKBIcPgOk/Zv4PYVQpJr2VuG0eXZsjmZ\r\na3m/lC4l8Bj3\r\n=9bjx\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
  };

  const data = {
    "@context": "https://w3id.org/identity/v1",
    givenName: "Alice"
  };

  it("should support sign and verify of linked data", async () => {
    expect.assertions(3);
    const signed = await sign({
      data,
      privateKey: (await openpgp.key.readArmored(key.privateKey)).keys[0],
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
      publicKey: key.publicKey
    });
    expect(verified).toBe(true);
  });
});
