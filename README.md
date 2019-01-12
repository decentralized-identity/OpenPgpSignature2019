# PROPOSAL OpenPgpSignature2019

[![Build Status](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019.svg?branch=master)](https://travis-ci.org/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![codecov](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/PROPOSAL-OpenPgpSignature2019) [![Coverage Status](https://coveralls.io/repos/github/transmute-industries/PROPOSAL-OpenPgpSignature2019/badge.svg?branch=master)](https://coveralls.io/github/transmute-industries/PROPOSAL-OpenPgpSignature2019?branch=master)

This is a WIP proposal, and has not been formally submitted.

## Motivation

OpenPGP is a standard that defines formats for encryption keys and messages. By providing a Linked Data Signature suite that uses OpenPGP we can leverage a more established standard to support an emerging one (Linked Data Signatures). A Linked Data Signature Suite for OpenPGP also enables OpenPGP to be used as a building block for other standards, such as Decentralized Identifiers.

## Details

This signature suite follows the approach taken by [RsaSignature2017](https://github.com/transmute-industries/RsaSignature2017), and [EcdsaKoblitzSignature2016](https://github.com/transmute-industries/EcdsaKoblitzSignature2016).

Addionally it supports custom attribute for signature, and compaction and expansion to save space from PGP Armor.

## W3C Links

#### [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry)

#### [Linked Data Signatures](https://w3c-dvcg.github.io/ld-signatures)

#### [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/)
