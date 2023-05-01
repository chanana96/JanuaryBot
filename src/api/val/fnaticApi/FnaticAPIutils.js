const axios = require("axios");
const { baseURL } = require("../../../config/valorant/httpConfig");

const findTeam = async (matchData, playerID) => {
  let targetPlayerTeam = matchData.data.players.find(
    (p) => p.subject === playerID
  ).teamId;
  let playerTeam = matchData.data.players.filter(
    (a) => a.teamId === targetPlayerTeam
  );
  let oppositeTeamId = targetPlayerTeam === "Red" ? "Blue" : "Red";
  return {
    teamId: targetPlayerTeam,
    oppositeTeamId: oppositeTeamId,
    playerTeam: playerTeam,
  };
};

const getMap = async (matchData) => {
  const maps = (await axios.get(`${baseURL.valorantApi}maps`)).data;
  const { displayName, listViewIcon } = maps.data.filter(
    (mapName) => mapName.mapUrl === matchData[0].matchData.matchInfo.mapId
  )[0];
  return {
    name: displayName,
    icon: listViewIcon,
  };
};

module.exports = { findTeam, getMap };
