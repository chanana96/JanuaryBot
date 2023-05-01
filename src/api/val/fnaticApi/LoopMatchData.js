const axios = require("axios");
const { findTeam } = require("./FnaticAPIutils");
const {
  fnaticRestrictedAgents: { Phoenix, Reyna, Sage, Skye },
} = require("../../../config/valorant/config");
const {
  baseURL,
  agent,
  requestHeaders,
} = require("../../../config/valorant/httpConfig");

const restrictedAgents = (playerId, playerID) =>
  playerId === playerID ? [Phoenix, Reyna, Sage] : [Sage, Skye];

const loopData = async ({
  tokens,
  matchIDs,
  matches_to_aggregate,
  region,
  puuid,
}) => {
  try {
    const validMatches = [];

    const getData = async (MatchID) => {
      const matchData = await axios.get(
        `${baseURL.playerData(region)}match-details/v1/matches/${MatchID}`,
        {
          headers: requestHeaders(tokens),
          httpsAgent: agent,
        }
      );

      const teamData = await findTeam(matchData, puuid);

      const isValid = teamData.playerTeam.every(
        (player) =>
          !restrictedAgents(player.subject, puuid).includes(player.characterId)
      );

      if (isValid) {
        return { matchData: matchData.data, teamData: teamData };
      }
      return null;
    };

    const promises = matchIDs.map((matchID) => getData(matchID.MatchID));

    const results = await Promise.allSettled(promises);

    for (const result of results) {
      if (result.status === "fulfilled" && result.value !== null) {
        validMatches.push(result.value);
      }

      if (validMatches.length === matches_to_aggregate) {
        break;
      }
    }

    return validMatches;
  } catch (error) {
    console.error(error);
  }
};

module.exports = { loopData };
