const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

const {
  documentLoader,
  documentExample,
  dids,
  credentials
} = require("./__fixtures__");

const { version } = require("../../package.json");

describe("bin", () => {
  it("version", async () => {
    const versionCommand = `
    npm --silent run openpgpsignature2019 version 
  `;
    const result = shell.exec(versionCommand, { silent: true });
    const parsed = JSON.parse(result.stdout);
    expect(parsed["@transmute/openpgpsignature2019"]).toBe(version);
  });

  it("sign", async () => {
    const pathToFile = path.resolve(
      __dirname,
      "./__fixtures__/documents/customContext.json"
    );
    const pathToSigned = path.resolve(
      __dirname,
      "./__fixtures__/documents/customContextSigned.gpg.json"
    );
    const signCommand = `
    NODE_ENV='development' npm --silent run openpgpsignature2019 sign -- -u "3AF00854CF8D9237" -o ${pathToSigned} ${pathToFile} did:example:123#key-0
  `;
    const result = shell.exec(signCommand, { silent: true });
    const credential = JSON.parse(result.stdout);
    expect(credential["@context"]).toBe("https://w3id.org/security/v2");
    expect(credential["coolCustomContext:myCustomProperty1337"]).toBe(
      "deadbeef"
    );
    expect(credential.proof.type).toBe("OpenPgpSignature2019");
    expect(credential.proof.created).toBeDefined();
    expect(credential.proof.proofPurpose).toBe("assertionMethod");
    expect(credential.proof.verificationMethod).toBe("did:example:123#key-0");
    expect(credential.proof.signatureValue).toBeDefined();
  });

  it("verify", async () => {
    const pathToSigned = path.resolve(
      __dirname,
      "./__fixtures__/documents/customContextSigned.gpg.json"
    );
    const verifyCommand = `
    NODE_ENV='development' npm --silent run openpgpsignature2019 verify -- ${pathToSigned}
  `;
    const result = shell.exec(verifyCommand, { silent: true });
    const parsed = JSON.parse(result.stdout);

    // console.log(result.stdout);
    expect(parsed.verified).toBe(true);
  });
});
