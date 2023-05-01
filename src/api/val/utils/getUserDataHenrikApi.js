const axios = require("axios");
const { baseURL } = require("../../../config/valorant/httpConfig");

const getUserDataHenrikApi = async (username, tag) => {
  const { puuid, region } = (
    await axios.get(`${baseURL.henrik}account/${username}/${tag}`)
  ).data.data;
  return {
    puuid: puuid,
    region: region,
    username: username,
    tag: tag,
  };
};

module.exports = { getUserDataHenrikApi };
