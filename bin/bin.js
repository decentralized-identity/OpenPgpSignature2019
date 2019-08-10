const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const vorpal = require("vorpal")();

const { version } = require("../package.json");

const OpenPgpSignature2019 = require("../src");

vorpal.wait = seconds =>
  new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });

vorpal.command("version", "display version").action(async () => {
  // eslint-disable-next-line
  console.log(
    JSON.stringify(
      {
        "@transmute/openpgpsignature2019": version
      },
      null,
      2
    )
  );
  return vorpal.wait(1);
});

vorpal
  .command("sign <inputFilePath> <verificationMethod>", "Sign file")

  .option(
    "-u, --local-user <key>",
    "Use name as the key to sign with. Note that this option overrides --default-key."
  )
  .option("-o, --output <outputFilePath>", "Write output to file")
  .option("-p, --purpose <proofPurpose>", "Purpose of signature")
  .option("-c, --created <created>", "Created date as iso string")

  .action(async args => {
    // set defaults properly
    args.options.created = args.options.created || new Date().toISOString();
    args.options.purpose = args.options.purpose || "assertionMethod";

    const fileJson = fs.readFileSync(args.inputFilePath).toString("utf-8");
    let parsedInputFile;
    try {
      parsedInputFile = JSON.parse(fileJson);
    } catch (e) {
      throw new Error("Could not parse inputFilePath as JSON.");
    }

    const proof = {
      type: "OpenPgpSignature2019",
      verificationMethod: args.verificationMethod,
      proofPurpose: args.options.purpose,
      created: args.options.created,
      documentLoader:
        process.env.NODE_ENV === "development"
          ? require("../src/__tests__/__fixtures__").documentLoader
          : undefined
    };

    const {
      framed,
      verifyDataHexString
    } = await OpenPgpSignature2019.createVerifyData(parsedInputFile, proof);

    const keyName = args.options["local-user"]
      ? `-u ${args.options["local-user"]}`
      : `--default-key`;

    const signDetachedCommand = `
       echo "${verifyDataHexString}" | gpg --detach-sign --armor ${keyName}
    `;

    const result = shell.exec(signDetachedCommand, { silent: true });

    // TODO: add openpgp validation here.
    const signatureValue = result.stdout;

    const signed = {
      ...framed,
      proof: {
        ...proof,
        signatureValue
      }
    };

    const signedDocument = JSON.stringify(signed, null, 2);
    console.log(signedDocument);
    if (args.options.output) {
      fs.writeFileSync(args.options.output, signedDocument);
    }
    return vorpal.wait(1);
  });

vorpal
  .command("verify <inputFilePath>", "Verify file")

  .action(async args => {
    const fileJson = fs.readFileSync(args.inputFilePath).toString("utf-8");
    let parsedInputFile;
    try {
      parsedInputFile = JSON.parse(fileJson);
    } catch (e) {
      throw new Error("Could not parse inputFilePath as JSON.");
    }

    // The following code will verify the signature assuming you have imported the key
    // listed in verificationMethod to GPG.
    // const {
    //   framed,
    //   verifyDataHexString
    // } = await OpenPgpSignature2019.createVerifyData(
    //   parsedInputFile,
    //   parsedInputFile.proof
    // );
    // const verifyWithGPGCommand = `
    // tmpFile=$(mktemp /tmp/openpgp-signature-2019-verifyData.XXXXXX)
    // tmpSig=$(mktemp /tmp/openpgp-signature-2019-sig.XXXXXX)
    // echo "${verifyDataHexString}" > "$tmpFile"
    // echo "${parsedInputFile.proof.signatureValue}" > "$tmpSig"
    // gpg --verify --armor "$tmpSig" "$tmpFile"
    // rm "$tmpFile"
    // rm "$tmpSig"
    // `;
    // const result = shell.exec(verifyWithGPGCommand, { silent: true });
    // console.log(result.stdout);
    // console.log(result.stderr);

    const verified = await OpenPgpSignature2019.verify({
      data: parsedInputFile,
      options: {
        documentLoader:
          process.env.NODE_ENV === "development"
            ? require("../src/__tests__/__fixtures__").documentLoader
            : undefined
      }
    });
    console.log(JSON.stringify({ verified }, null, 2));
    return vorpal.wait(1);
  });

vorpal.parse(process.argv);
if (process.argv.length === 0) {
  vorpal.delimiter("🔏 ").show();
}
