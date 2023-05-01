const { Agent } = require("https");
const { userAgent, ciphers } = require("./httpConfigValues");

const requestHeaders = (tokens) => ({
  "X-Riot-Entitlements-JWT": tokens.entitlements,
  Authorization: `Bearer ${tokens.access_token}`,
});

const setEntitlementHeaders = (tokens) => ({
  "User-Agent": userAgent,
  Authorization: `Bearer ${tokens.access_token}`,
});

const ssidCookieHeaders = (cookies) => ({
  "User-Agent": userAgent,
  Cookie: cookies,
});

const AuthCookiesBody = {
  client_id: "play-valorant-web-prod",
  nonce: 1,
  redirect_uri: "https://playvalorant.com/opt_in",
  response_type: "token id_token",
  scope: "account openid",
};

const AuthRequestBody = (login, password) => ({
  type: "auth",
  username: login,
  password: password,
  remember: true,
  language: "en_US",
});

const MultiFactorAuthenticationBody = (code) => ({
  type: "multifactor",
  code: code,
  rememberDevice: false,
});

const AuthRegionBody = (tokens) => ({
  id_token: tokens.id_token,
});

const baseURL = {
  authURL: "https://auth.riotgames.com/api/v1/authorization",
  setEntitlements: "https://entitlements.auth.riotgames.com/api/token/v1",
  CookieReAuth:
    "https://auth.riotgames.com/authorize?redirect_uri=https%3A%2F%2Fplayvalorant.com%2Fopt_in&client_id=play-valorant-web-prod&response_type=token%20id_token&nonce=1",
  henrik: "https://api.henrikdev.xyz/valorant/v1/",
  valorantApi: `https://valorant-api.com/v1/`,
  playerInfo: "https://auth.riotgames.com/userinfo",
  playerRegion: "https://riot-geo.pas.si.riotgames.com/pas/v1/product/valorant",
  playerData: function (region) {
    return `https://pd.${region}.a.pvp.net/`;
  },
};

const agent = new Agent({
  ciphers: ciphers.join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.2",
});

module.exports = {
  requestHeaders,
  setEntitlementHeaders,
  ssidCookieHeaders,
  AuthCookiesBody,
  AuthRequestBody,
  AuthRegionBody,
  MultiFactorAuthenticationBody,
  baseURL,
  agent,
};
