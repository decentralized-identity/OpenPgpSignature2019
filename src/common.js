const jsonld = require("jsonld");
const crypto = require("crypto");

const canonize = async data => {
  return jsonld.canonize(data);
};

const sha256 = data => {
  const h = crypto.createHash("sha256");
  h.update(data);
  return h.digest("hex");
};

const createVerifyData = async (data, options, signatureAttribute ) => {
  const transformedOptions = {
    ...options,
    "@context": "https://w3id.org/identity/v1"
  };
  delete transformedOptions["type"];
  delete transformedOptions["id"];
  delete transformedOptions["signatureValue"];
  const canonizedOptions = await canonize(transformedOptions);
  const optionsHash = await sha256(canonizedOptions);
  const transformedData = { ...data };
  delete transformedData[signatureAttribute];
  const cannonidedData = await canonize(transformedData);
  const documentHash = await sha256(cannonidedData);
  const verifyData = `${optionsHash}${documentHash}`;
  return verifyData;
};

module.exports = {
  sha256,
  canonize,
  createVerifyData
};