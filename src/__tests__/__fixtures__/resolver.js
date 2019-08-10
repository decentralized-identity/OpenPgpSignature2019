const dids = require("./dids");

const resolver = {
  resolve: didUri => {
    const did = didUri.split("#")[0];
    return dids[did] ? dids[did].document : null;
  }
};

module.exports = resolver;
