const vorpal = require("vorpal")();

const { version } = require("../package.json");

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

vorpal.parse(process.argv);
if (process.argv.length === 0) {
  vorpal.delimiter("🔏 ").show();
}
