const userAgent =
  "RiotClient/64.0.10.5036631.232 rso-auth (Windows;10;;Professional, x64)";

const ciphers = [
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
  "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
];

module.exports = {
  userAgent,
  ciphers,
};
