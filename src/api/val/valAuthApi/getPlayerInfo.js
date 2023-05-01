const axios = require("axios");

const {
  baseURL,
  setEntitlementHeaders,
  agent,
  AuthRegionBody,
} = require("../../../config/valorant/httpConfig");

const getUsernameTagPUUID = async (tokens) => {
  const response = (
    await axios.get(baseURL.playerInfo, {
      headers: setEntitlementHeaders(tokens),
      httpsAgent: agent,
    })
  ).data;
  return {
    puuid: response.sub,
    username: response.acct.game_name,
    tag: response.acct.tag_line,
  };
};

const initPlayerData = async (tokens) => {
  const UsernameTagPUUID = await getUsernameTagPUUID(tokens);
  const response = (
    await axios.put(baseURL.playerRegion, AuthRegionBody(tokens), {
      headers: setEntitlementHeaders(tokens),
      httpsAgent: agent,
    })
  ).data;
  const data = {
    ...UsernameTagPUUID,
    region: response.affinities.live,
    ssid: tokens.ssid,
  };
  return data;
};

module.exports = { initPlayerData };
