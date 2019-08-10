### Generating RSA Keys

```
openssl genrsa -out privateKey.pem 2048  
openssl rsa -in privateKey.pem -outform PEM -pubout -out publicKey.pem
```

// const schemaOrgPerson = {
//   "@context": "http://schema.org/",
//   "@type": "Person",
//   name: "Jane Doe",
//   jobTitle: "Professor",
//   telephone: "(425) 123-4567",
//   url: "http://www.janedoe.com"
// };

// const doc = {
//   '@context': {
//     schema: 'http://schema.org/',
//     action: 'schema:action'
//   },
//   action: 'AuthenticateMe'
// };

// https://www.w3.org/ns/activitystreams.jsonld