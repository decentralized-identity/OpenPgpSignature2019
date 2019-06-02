const openpgp = require("openpgp");

module.exports = async options => {
  const key = await openpgp.generateKey(options);
  return {
    publicKey: key.publicKeyArmored,
    privateKey: key.privateKeyArmored,
    revocationCertificate: key.revocationCertificate
  };
};
