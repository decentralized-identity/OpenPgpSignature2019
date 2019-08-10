const keys = require("./keys");

module.exports = {
  "@context": "https://w3id.org/did/v1",
  id: "did:example:123",
  publicKey: [
    {
      type: "OpenPgpVerificationKey2019",
      id: "did:example:123#key-0",
      controller: "did:example:123",
      publicKeyPgp: keys.key0.publicKey
    },
    {
      type: "OpenPgpVerificationKey2019",
      id: "did:example:123#key-1",
      controller: "did:example:123",
      publicKeyPgp: keys.key1.publicKey
    }
  ],
  service: [
    {
      // used to retrieve Verifiable Credentials associated with the DID
      type: "VerifiableCredentialService",
      serviceEndpoint: "https://example.com/vc/"
    }
  ]
};
