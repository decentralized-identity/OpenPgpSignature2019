# PROPOSAL OpenPgpSignature2019

[![Build Status](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019.svg?branch=master)](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![codecov](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![Coverage Status](https://coveralls.io/repos/github/transmute-industries/PROPOSAL-OpenPgpSignature2019/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/PROPOSAL-OpenPgpSignature2019?branch=master)

This is a WIP proposal, and has not been formally submitted.

If you want to use this library with GPG:

```
npm i -g @transmute/openpgpsignature2019@latest
```

If you want to use this library as a dependency

```
npm i @transmute/openpgpsignature2019@latest --save
```

## Motivation

OpenPGP is a standard that defines formats for encryption keys and messages. By providing a Linked Data Signature suite that uses OpenPGP we can leverage a more established standard to support an emerging one (Linked Data Signatures). A Linked Data Signature Suite for OpenPGP also enables OpenPGP to be used as a building block for other standards, such as Decentralized Identifiers.

## Details

This signature suite follows the approach taken by:

- [Ed25519Signature2018](https://github.com/transmute-industries/Ed25519Signature2018)
- [RsaSignature2017](https://github.com/transmute-industries/RsaSignature2017)
- [EcdsaKoblitzSignature2016](https://github.com/transmute-industries/EcdsaKoblitzSignature2016)

We provide a binary which you can use to create JSON-LD Signatures with your local gpg key that already exist, including keys that are connected to smart cards like Yubikey NEO.

We support the [universal-resolver](https://github.com/decentralized-identity/universal-resolver) for signing and verifying with DIDs by default, but you can provide your own custom document resolver, see the [defaultDocumentLoader](./src/defaultDocumentLoader.js)

## Binary Use

If you are interested in using Yubikey see this [setup guide](./docs/README.md).

#### Sign a json document:

```
openpgpsignature2019 sign -u "3AF00854CF8D9237" $(pwd)/src/__tests__/__fixtures__/documents/example.json did:btcr:xxcl-lzpq-q83a-0d5#yubikey
```

#### Verify a document

```
openpgpsignature2019 verify $(pwd)/src/__tests__/__fixtures__/documents/exampleSigned.json
```

## Library Use

See [tests](./src/__tests__).

```js
const keys = await OpenPgpSignature2019.generateKey({
  userIds: [
    {
      name: "anon@example.com"
    }
  ],
  curve: "secp256k1"
});
// Looks like this:
// const keys = {
//   publicKey:
//     "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRIiYW5vbkBl\r\neGFtcGxlLmNvbSLCdwQQEwgAHwUCXPQjDgYLCQcIAwIEFQgKAgMWAgECGQEC\r\nGwMCHgEACgkQOqx3TfQyHavsPAEA7Ah6P2cs9B/72bfMiWgeBcEOTIIBjaQ+\r\nHycfG5ldmpQBAP30Tqo0yuwiaf/qDOLnzrXPQIyz1noKdYpXgGOpzivWzlME\r\nXPQjDhIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBg\r\nRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB8JhBBgTCAAJ\r\nBQJc9CMOAhsMAAoJEDqsd030Mh2re2cA/jr04uWORrq1rXnfGWUeg3uSc0Dw\r\nhzSqweh/a64RHkUvAP0d6whaffpbnb2pnlivCraq+EyBPuDrJFXRpFMA7v6N\r\nQw==\r\n=kUuh\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
//   privateKey:
//     "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxXQEXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAAEAtt9uYl73\r\noEnh1lAB1SqGxc1o1c6C4lx4myXH3P+WRD4SgM0SImFub25AZXhhbXBsZS5j\r\nb20iwncEEBMIAB8FAlz0Iw4GCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJ\r\nEDqsd030Mh2r7DwBAOwIej9nLPQf+9m3zIloHgXBDkyCAY2kPh8nHxuZXZqU\r\nAQD99E6qNMrsImn/6gzi5861z0CMs9Z6CnWKV4Bjqc4r1sd4BFz0Iw4SBSuB\r\nBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMgYEQxYQeunmpt\r\nCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAcAAQC2325iXvegSeHWUAHV\r\nKobFzWjVzoLiXHibJcfc/5ZEPhKAwmEEGBMIAAkFAlz0Iw4CGwwACgkQOqx3\r\nTfQyHat7ZwD+OvTi5Y5GurWted8ZZR6De5JzQPCHNKrB6H9rrhEeRS8A/R3r\r\nCFp9+ludvameWK8Ktqr4TIE+4OskVdGkUwDu/o1D\r\n=EnRP\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n",
//   revocationCertificate:
//     "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\nComment: This is a revocation certificate\r\n\r\nwmEEIBMIAAkFAlz0Iw4CHQAACgkQOqx3TfQyHavq6gEAziFfOR1SeAzJd9LW\r\nm7EqSmYtJA+3c2Am8hyUnYTF92oBAOKcWz/h2UbTDJnqXSRa9j1MzRilhQKs\r\n8Bo+tH1N3smt\r\n=RDKz\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
// };

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

let signedData = await OpenPgpSignature2019.sign({
  data: doc,
  privateKey: keys.privateKey,
  proof: {
    verificationMethod: "https://example.com/i/alice/keys/1",
    proofPurpose: "assertionMethod"
  }
});

// Looks like this:
// let signedData = {
//   "@context": "https://w3id.org/security/v2",
//   "http://schema.org/image": "https://manu.sporny.org/images/manu.png",
//   "http://schema.org/name": "Manu Sporny",
//   "http://schema.org/url": "https://manu.sporny.org/",
//   proof: {
//     verificationMethod: "https://example.com/i/alice/keys/1",
//     proofPurpose: "assertionMethod",
//     created: "2019-06-02T20:24:21.635Z",
//     type: "OpenPgpSignature2019",
//     signatureValue:
//       "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlz0MHcACgkQlSqpRbrzz18c1wEAsIUoldZyDKFYJNm5feYV\r\nq1YnajCSPBNCTtXnl6cOUb8A/1cH8rc7Mrbq6ZIlIbvbhpAEo7tu7C5GUtfB\r\njFThEyqU\r\n=zYH+\r\n-----END PGP SIGNATURE-----\r\n"
//   }
// };

// We need to define a custom loader, because "https://example.com/i/alice/keys/1" is not a public url.
const customLoader = (url, callback) => {
  const CONTEXTS = {
    "https://example.com/i/alice/keys/1": {
      "@context": "https://w3id.org/security/v2",
      type: "OpenPgpVerificationKey2019",
      id: "https://example.com/i/alice/keys/1",
      controller: "https://example.com/i/alice",
      publicKeyPgp:
        "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRIiYW5vbkBl\r\neGFtcGxlLmNvbSLCdwQQEwgAHwUCXPQjDgYLCQcIAwIEFQgKAgMWAgECGQEC\r\nGwMCHgEACgkQOqx3TfQyHavsPAEA7Ah6P2cs9B/72bfMiWgeBcEOTIIBjaQ+\r\nHycfG5ldmpQBAP30Tqo0yuwiaf/qDOLnzrXPQIyz1noKdYpXgGOpzivWzlME\r\nXPQjDhIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBg\r\nRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB8JhBBgTCAAJ\r\nBQJc9CMOAhsMAAoJEDqsd030Mh2re2cA/jr04uWORrq1rXnfGWUeg3uSc0Dw\r\nhzSqweh/a64RHkUvAP0d6whaffpbnb2pnlivCraq+EyBPuDrJFXRpFMA7v6N\r\nQw==\r\n=kUuh\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
    }
  };
  if (url in CONTEXTS) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[url], // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    });
  }
  return nodeDocumentLoader(url, callback);
};

const verified = await OpenPgpSignature2019.verify({
  data: signedData,
  options: {
    documentLoader: customLoader
  }
});

// we expect verified === true
```

### Working With DIDs

DIDs are supported through a custom document loader, which uses the DID Method resolver.

See [working-with-dids.spec.js](./src/__tests__/working-with-dids.spec.js).

```js
const resolver = {
  // this is a stub / example... see https://uniresolver.io/
  resolve: did => {
    return {
      "@context": "https://w3id.org/did/v1",
      id: "did:example:123",
      publicKey: [
        {
          "@context": "https://w3id.org/security/v2",
          type: "OpenPgpVerificationKey2019",
          id: "did:example:123#kid-456",
          controller: "did:example:123",
          publicKeyPgp:
            "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXPQjDhMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRIiYW5vbkBl\r\neGFtcGxlLmNvbSLCdwQQEwgAHwUCXPQjDgYLCQcIAwIEFQgKAgMWAgECGQEC\r\nGwMCHgEACgkQOqx3TfQyHavsPAEA7Ah6P2cs9B/72bfMiWgeBcEOTIIBjaQ+\r\nHycfG5ldmpQBAP30Tqo0yuwiaf/qDOLnzrXPQIyz1noKdYpXgGOpzivWzlME\r\nXPQjDhIFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBg\r\nRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB8JhBBgTCAAJ\r\nBQJc9CMOAhsMAAoJEDqsd030Mh2re2cA/jr04uWORrq1rXnfGWUeg3uSc0Dw\r\nhzSqweh/a64RHkUvAP0d6whaffpbnb2pnlivCraq+EyBPuDrJFXRpFMA7v6N\r\nQw==\r\n=kUuh\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n"
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
  }
};

const customLoader = (id, callback) => {
  // are we handling a DID? (probably you want better validation than this.)
  if (id.indexOf("did:example") === 0) {
    const doc = resolver.resolve(id);
    // iterate public keys, find the correct id...
    // use different logic for other DID properties...
    // see https://w3c-ccg.github.io/did-spec/
    for (publicKey of doc.publicKey) {
      if (publicKey.id === id) {
        return callback(null, {
          contextUrl: null, // this is for a context via a link header
          document: publicKey, // this is the actual document that was loaded
          documentUrl: id // this is the actual context URL after redirects
        });
      }
    }
  }

  //   are we handling a custom context?
  if (id in CONTEXTS) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: CONTEXTS[id], // this is the actual document that was loaded
      documentUrl: id // this is the actual context URL after redirects
    });
  }

  //   is this a published (public) context?
  return nodeDocumentLoader(id, callback);
};

const data = {
  "@context": "https://example.com/coolCustomContext/v1",
  myCustomProperty1337: "deadbeef"
};

let signedData = await OpenPgpSignature2019.sign({
  data,
  privateKey: "PRIVATE_KEY",
  proof: {
    verificationMethod: "did:example:123#kid-456", // notice this is not a URL!
    proofPurpose: "assertionMethod"
  },
  options: {
    documentLoader: customLoader,
    passphrase: "correct horse battery staple" // if required
  }
});

const verified = await OpenPgpSignature2019.verify({
  data: signedData,
  options: {
    documentLoader: customLoader
  }
});

if (verified) {
  console.log(
    "Signature verification succeeded...But you might need to do more validation..."
  );
} else {
  console.log("Signature verification failed... The key might be revoked!");
}
```

## Commercial Support

Commercial support for this library is available upon request from
Transmute: support@transmute.industries.

## License

This library uses OpenPGP.js to sign and verify, as well as manage armored key encoding / decoding. OpenPGP.js is not modified in any way. This library also supports calling gpg directly.

[OpenPGP.js](https://github.com/openpgpjs/openpgpjs) is LGPL v3, see its [LICENSE](https://github.com/openpgpjs/openpgpjs/blob/master/LICENSE)

It is our understanding that LGPL v3 dependencies can be included in an Apache 2 Licensed library so long as the following criteria are satisfied:

- We state we are using OpenPGP.js and provide a link to its source code, license and copyright.
- You can modify openpgp.js, it is in node_modules.

## W3C Links

#### [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry)

#### [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures)

#### [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/)
