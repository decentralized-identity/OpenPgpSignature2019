# Documentation

#### [Latest Spec](https://transmute-industries.github.io/PROPOSAL-OpenPgpSignature2019/)

#### Yubikey NEO

Build Form Source:

https://developers.yubico.com/yubico-c/

https://developers.yubico.com/yubikey-personalization/

Connect Yubikey

See [Generating a key on yubikey](https://support.yubico.com/support/solutions/articles/15000006420-using-your-yubikey-with-openpgp#Generating_Your_PGP_Key_Directly_on_Your_YubiKeyttvb3m

)

```
gpg-connect-agent --hex "scd apdu 00 f1 00 00" /bye
gpg --card-edit
generate
```

Follow instructions:

Make sure to choose to export your keys, you will not be able to access them again if you do not.

At the end you should see:

```
gpg: Note: backup of card key saved to '/Users/USER/.gnupg/sk_3AF00854CF8D9237.gpg'
gpg: revocation certificate stored as '/Users/USER/.gnupg/openpgp-revocs.d/F1BD12F71206FAA1F236997D60042D876C326166.rev'
public and secret key created and signed.
```

Show the keys on the card:

```
list
```

Export a public key:

```
gpg --armor --export james@example.com

```

Encrypt and decrypt:

```
echo "test message string" | gpg --encrypt --armor -u 3AF00854CF8D9237 --recipient 3AF00854CF8D9237 -o encrypted.txt

gpg --decrypt --armor encrypted.txt
```

Sign and Verify:

```
echo "test message string" | gpg --sign --armor -u 3AF00854CF8D9237  -o signed.txt
cat signed.txt | gpg --verify --armor
```
