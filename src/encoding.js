const compact = signature => {
  if (signature.indexOf("PGP SIGNATURE") == -1) {
    return signature;
  }
  const lines = signature.trim().split("\n");
  let data = [];
  lines.forEach(line => {
    if (line.indexOf("PGP SIGNATURE") !== -1) {
      return;
    }
    if (line.indexOf("Version") !== -1) {
      return;
    }
    if (line.indexOf("Comment") !== -1) {
      return;
    }
    if (line === "") {
      return;
    }
    data.push(line);
  });
  data = data.map(d => {
    return d.replace(/\r?\n?/g, "");
  });
  const compacted = data.join("");
  return compacted;
};

const expand = signature => {
  if (signature.indexOf("PGP SIGNATURE") != -1) {
    return signature;
  }
  let body = signature.substring(0, signature.length - 5);
  let end = signature.substring(signature.length - 5, signature.length).trim();
  let lines = [];
  while (body.length >= 60) {
    lines.push(body.substring(0, 60));
    body = body.substring(60, body.length);
  }
  lines.push(body);
  lines.push(end);
  const armoredSignature = `
  
-----BEGIN PGP SIGNATURE-----

${lines.join("\n")}
-----END PGP SIGNATURE-----
`.trim();
  return armoredSignature;
};

module.exports = {
  compact,
  expand
};
