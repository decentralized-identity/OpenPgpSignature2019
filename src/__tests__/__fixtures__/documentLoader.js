const jsonld = require("jsonld");
const nodeDocumentLoader = jsonld.documentLoaders.node();
const contexts = require("./contexts");
const resolver = require("./resolver");

const customLoader = (url, callback) => {
  // console.log(url);
  // are we handling a DID?
  if (url.indexOf("did:example") === 0) {
    const doc = resolver.resolve(url);
    // iterate public keys, find the correct id...
    for (publicKey of doc.publicKey) {
      if (publicKey.id === url) {
        return callback(null, {
          contextUrl: null, // this is for a context via a link header
          document: publicKey, // this is the actual document that was loaded
          documentUrl: url // this is the actual context URL after redirects
        });
      }
    }
  }

  //   are we handling a custom context?
  if (url in contexts) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: contexts[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    });
  }

  //   is this a published (public) context?
  return nodeDocumentLoader(url, callback);
};

module.exports = customLoader;
