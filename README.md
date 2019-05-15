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

## Example Use

```js
const openpgp = require("openpgp");
const OpenPgpSignature2019 = require("@transmute/openpgpsignature2019");

const keypair = {
  publicKey:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxk8EXDT/8hMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAzRMiYWxpY2VA\r\nZXhhbXBsZS5jb20iwncEEBMIAB8FAlw0//IGCwkHCAMCBBUICgIDFgIBAhkB\r\nAhsDAh4BAAoJEEp6Ac0q7g1gohoBAP0pOtmgx6TSpL94tCTFL8jxjphNBfSG\r\neugvsDf/huzyAP9tSDRRCA6src6v/orOChQ0BbcM8zXVQw8K33I2yxAWRM5T\r\nBFw0//ISBSuBBAAKAgMENtibiizsNERI4B9yj5Xb6UC8j23rzup3f77P4VMg\r\nYEQxYQeunmptCoNCv2xbKXexKgUH+bIODI7VtoPlJTDbgAMBCAfCYQQYEwgA\r\nCQUCXDT/8gIbDAAKCRBKegHNKu4NYPkTAQDXNkA3BUEQEOVZ4MGMU3K1Z+Kp\r\n4jnuQCtaX6fQDMseBAEA8iIId8uCS7KXkQhxD9hPCZQ52ttDZI8S2/IRx/+S\r\nZF8=\r\n=/os5\r\n-----END PGP PUBLIC KEY BLOCK-----\r\n",
  privateKey:
    "-----BEGIN PGP PRIVATE KEY BLOCK-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nxaIEXDT/8hMFK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/h\r\nUyBgRDFhB66eam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuA/gkDCAAAAAAA\r\nAAAA4AAAAAAAAAAAAAAAAAAAAAB5UQ0maxamLRPs6EDvbJQVSBQYKcsF4adJ\r\njaxjHC3SQTnfNNLDsH5gegr1GDP5F6QjmSB2/AHNEyJhbGljZUBleGFtcGxl\r\nLmNvbSLCdwQQEwgAHwUCXDT/8gYLCQcIAwIEFQgKAgMWAgECGQECGwMCHgEA\r\nCgkQSnoBzSruDWCiGgEA/Sk62aDHpNKkv3i0JMUvyPGOmE0F9IZ66C+wN/+G\r\n7PIA/21INFEIDqytzq/+is4KFDQFtwzzNdVDDwrfcjbLEBZEx6YEXDT/8hIF\r\nK4EEAAoCAwQ22JuKLOw0REjgH3KPldvpQLyPbevO6nd/vs/hUyBgRDFhB66e\r\nam0Kg0K/bFspd7EqBQf5sg4MjtW2g+UlMNuAAwEIB/4JAwgAAAAAAAAAAOAA\r\nAAAAAAAAAAAAAAAAAAAAeVENJmsWpi0T7OhA72yUFUgUGCnLBeGnSY2sYxwt\r\n0kE53zTSw7B+YHoK9Rgz+RekI5kgdvwBwmEEGBMIAAkFAlw0//ICGwwACgkQ\r\nSnoBzSruDWD5EwEA1zZANwVBEBDlWeDBjFNytWfiqeI57kArWl+n0AzLHgQB\r\nAPIiCHfLgkuyl5EIcQ/YTwmUOdrbQ2SPEtvyEcf/kmRf\r\n=uotq\r\n-----END PGP PRIVATE KEY BLOCK-----\r\n"
};

const data = {
  "@context": "https://w3id.org/identity/v1",
  givenName: "Alice"
};

const signedData = await OpenPgpSignature2019.sign({
  data,
  domain: "github-did",
  signatureAttribute: "proof",
  // compact: true,
  creator: "did:example:123",
  privateKey: (await openpgp.key.readArmored(keypair.privateKey)).keys[0]
});

// signedData = {
//   "@context": "https://w3id.org/identity/v1",
//   "givenName": "Alice",
//   "proof": {
//     "type": "OpenPgpSignature2019",
//     "creator": "did:example:123",
//     "domain": "example.com",
//     "nonce": "a7c3d7657bd597b0c94d0e6f91227fde",
//     "created": "2019-01-12T17:49:15.679Z",
//     "signatureValue": "-----BEGIN PGP SIGNATURE-----\r\nVersion: OpenPGP.js v4.4.3\r\nComment: https://openpgpjs.org\r\n\r\nwl4EARMIAAYFAlw6KJwACgkQSnoBzSruDWCONgD+JToi7bLcxGJsj5ROGGb1\r\n2eEIKU7TRAfSaSAIirRDuycA/RhfTM29i8+YkuigQAwwEDJ111WzXDdFnR0w\r\nj9W4NkAJ\r\n=q5gA\r\n-----END PGP SIGNATURE-----\r\n"
//   }
// }

const verified = await verify({
  data: signedData,
  signatureAttribute: "proof",
  publicKey: fkeypair.publicKey
});

// we expect verified to be true.
```

See the [tests](./src/__tests__/OpenPgpSignature2019.spec.js) for more usage examples.

See also GitHubDID for a sample project that uses this suite in its library:

- [Library](https://github.com/decentralized-identity/github-did/blob/master/packages/lib/src/index.js#L127)
- [Test](https://github.com/decentralized-identity/github-did/blob/master/packages/lib/src/__tests__/didWallet.spec.js#L29)

### Signed Compact

```js
const signedData = await sign({
  data,
  signatureOptions: {
    creator: "did:example:123"
  },
  options: {
    compact: true
  },
  privateKey
});

// signedData = {
//   "@context": "https://w3id.org/identity/v1",
//   "givenName": "Alice",
//   "proof": {
//     "type": "OpenPgpSignature2019",
//     "creator": "did:example:123",
//     "nonce": "6662f8ffb3859e1caea1657999a8b955",
//     "created": "2019-01-12T17:50:23.492Z",
//     "signatureValue": "wl4EARMIAAYFAlw6KOAACgkQSnoBzSruDWC2RgD7BMIKlodtaNFk2ZTUDoAoCyixxGI82vbihWV6mZoVSxAA/2ppmNLf81F76rRBbWfuQdZJaRKVKu6pRk8uU8mJn4Tt=hKRg"
//   }
// }
```

## GitHub DID Example

Here is an example of it being used in a [web app](https://github-did.com).

https://github-did.com/verify/eyJAY29udGV4dCI6Imh0dHBzOi8vdzNpZC5vcmcvaWRlbnRpdHkvdjEiLCJnaXZlbk5hbWUiOiJBbGljZSIsInByb29mIjp7InR5cGUiOiJPcGVuUGdwU2lnbmF0dXJlMjAxOSIsImNyZWF0b3IiOiJkaWQ6Z2l0aHViOk9SMTMja2lkPXVYOWtQUy1MSVBaY0pTNWFTMDdkSktMeVd5Ny1UVi1QZTA5YnpIN0hpa1UiLCJkb21haW4iOiJHaXRIdWJESUQiLCJub25jZSI6ImZjNzM2M2RkNWVkYjNlZDM5YmYwMGIwOGNkNTJkMDhlIiwiY3JlYXRlZCI6IjIwMTktMDUtMTVUMDQ6MzY6MTguMzE4WiIsInNpZ25hdHVyZVZhbHVlIjoiLS0tLS1CRUdJTiBQR1AgU0lHTkFUVVJFLS0tLS1cclxuVmVyc2lvbjogT3BlblBHUC5qcyB2NC41LjFcclxuQ29tbWVudDogaHR0cHM6Ly9vcGVucGdwanMub3JnXHJcblxyXG53bDRFQVJNSUFBWUZBbHpibDBJQUNna1E5dDlWMzRLR1R6ZmNNd0VBbnJqSGVtdFl5WG1VVXRWV21aN1pcclxueUpBeEtUc3BJSEVtMmlaWDB6eGpjUVlBLzE2UDI0S1BmUFZxWFdXTmZONWhSK2poM3dXSGFkVWxmSzZoXHJcbmczTDhVTExxXHJcbj12Sy9BXHJcbi0tLS0tRU5EIFBHUCBTSUdOQVRVUkUtLS0tLVxyXG4ifX0

You can verify this claim I signed.

## Commercial Support

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
