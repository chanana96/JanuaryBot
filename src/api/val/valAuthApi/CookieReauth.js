const axios = require("axios");
const {
  ssidCookieHeaders,
  baseURL,
  agent,
} = require("../../../config/valorant/httpConfig");
const { parseUrl } = require("../utils/parseUrl");
const { setTokenEntitlement } = require("./TokenAPI");

const getData = async (ssid) => {
  const response = await axios.get(baseURL.CookieReAuth, {
    headers: ssidCookieHeaders(`ssid=${ssid}`),
    httpsAgent: agent,
    validateStatus: (status) => {
      return status >= 200 && status < 500;
    },
  });
  const tokens = parseUrl(response.request.res.responseUrl);
  return setTokenEntitlement(tokens);
};

module.exports = { getData };
