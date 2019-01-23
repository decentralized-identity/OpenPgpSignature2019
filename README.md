# PROPOSAL OpenPgpSignature2019

[![Build Status](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019.svg?branch=master)](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![codecov](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![Coverage Status](https://coveralls.io/repos/github/transmute-industries/PROPOSAL-OpenPgpSignature2019/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/PROPOSAL-OpenPgpSignature2019?branch=master)

This is a WIP proposal, and has not been formally submitted.

## Motivation

OpenPGP is a standard that defines formats for encryption keys and messages. By providing a Linked Data Signature suite that uses OpenPGP we can leverage a more established standard to support an emerging one (Linked Data Signatures). A Linked Data Signature Suite for OpenPGP also enables OpenPGP to be used as a building block for other standards, such as Decentralized Identifiers.

## Details

This signature suite follows the approach taken by:
- [Ed25519Signature2018](https://github.com/transmute-industries/Ed25519Signature2018)
- [RsaSignature2017](https://github.com/transmute-industries/RsaSignature2017)
- [EcdsaKoblitzSignature2016](https://github.com/transmute-industries/EcdsaKoblitzSignature2016)

Addionally it supports custom attribute for signature, and compaction and expansion to save space from PGP Armor.


### Signed with Proof

```
{
  "@context": "https://w3id.org/identity/v1",
  "givenName": "Alice",
  "proof": {
    "type": "OpenPgpSignature2019",
    "creator": "did:example:123",
    "domain": "example.com",
    "nonce": "a7c3d7657bd597b0c94d0e6f91227fde",
    "created": "2019-01-12T17:49:15.679Z",
    "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlw6KJwACgkQSnoBzSruDWCONgD+JToi7bLcxGJsj5ROGGb1\r\n2eEIKU7TRAfSaSAIirRDuycA/RhfTM29i8+YkuigQAwwEDJ111WzXDdFnR0w\r\nj9W4NkAJ\r\n=q5gA\r\n-----END PGP SIGNATURE-----\r\n"
  }
}
```

### Signed Compact

```
{
  "@context": "https://w3id.org/identity/v1",
  "givenName": "Alice",
  "proof": {
    "type": "OpenPgpSignature2019",
    "creator": "did:example:123",
    "nonce": "6662f8ffb3859e1caea1657999a8b955",
    "created": "2019-01-12T17:50:23.492Z",
    "signatureValue": "wl4EARMIAAYFAlw6KOAACgkQSnoBzSruDWC2RgD7BMIKlodtaNFk2ZTUDoAoCyixxGI82vbihWV6mZoVSxAA/2ppmNLf81F76rRBbWfuQdZJaRKVKu6pRk8uU8mJn4Tt=hKRg"
  }
}
```

Commercial Support
------------------

Commercial support for this library is available upon request from
Transmute: support@transmute.industries.

## License

This library uses OpenPGP.js to sign and verify, as well as manage armored key encoding / decoding. OpenPGP.js is not modified in any way.

[OpenPGP.js](https://github.com/openpgpjs/openpgpjs) is LGPL v3, see its [LICENSE](https://github.com/openpgpjs/openpgpjs/blob/master/LICENSE)

It is our understanding that LGPL v3 dependencies can be included in an Apache 2 Licensed library so long as the following criteria are satisfied:

- We state we are using OpenPGP.js and provide a link to its source code, license and copyright.
- You can modify openpgp.js, it is in node_modules.

## W3C Links

#### [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry)

#### [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures)

#### [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/)
