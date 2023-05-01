const { heavyArmorCode } = require("../../../config/valorant/config");

const calculateMatches = async (matchData, playerID, mapData) => {
  const results = await Promise.all(
    matchData.map(async ({ matchData, teamData }) => {
      let r = [];

      let ChartData = {
        "Deaths if you had light armor": 0,
        "Deaths on heavy armor": 0,
      };
      let count = 0;
      const { gameLengthMillis } = matchData.matchInfo;

      const scores = matchData.teams.reduce((acc, team) => {
        const propName =
          team.teamId === teamData.teamId ? "teamId" : "oppositeTeamId";
        return { ...acc, [propName]: team.numPoints };
      }, {});

      const generalGameData = {
        minutes: Math.floor(gameLengthMillis / 60000),
        seconds: Math.floor((gameLengthMillis % 60000) / 1000),
        mapData,
        scores,
      };

      for (let round of matchData.roundResults) {
        let targetPlayer = round.playerStats.find((a) => a.subject == playerID);

        if (targetPlayer && targetPlayer.economy.armor == heavyArmorCode) {
          let totalDamage = 0;

          for (let playerStat of round.playerStats) {
            if (playerStat.subject !== playerID) {
              let damageToTarget = playerStat.damage
                .filter((dmgObj) => dmgObj.receiver == playerID)
                .reduce((acc, dmgObj) => acc + dmgObj.damage, 0);
              totalDamage += damageToTarget;
            }
          }

          if (totalDamage >= 125) {
            r.push({ [round.roundNum]: totalDamage });

            if (totalDamage < 150) {
              ChartData["Deaths if you had light armor"] += 1;
              console.log(
                `round survived with less than 25 hp: round ${
                  round.roundNum + 1
                } - total damage: ${totalDamage}`
              );
            } else {
              ChartData["Deaths on heavy armor"] += 1;
            }
            const { oppositeTeamId } = teamData;

            let oppositeTeamEconomies = round.playerEconomies.filter(
              (e) =>
                matchData.players.find((p) => p.subject === e.subject)
                  .teamId === oppositeTeamId && e.loadoutValue
            );

            let oppositeTeamLoadoutValue =
              oppositeTeamEconomies.reduce(
                (sum, economy) => sum + economy.loadoutValue,
                0
              ) / oppositeTeamEconomies.length;

            if (oppositeTeamLoadoutValue >= 3900) {
              count += 600;
            }
          }
        }
      }
      return { ChartData, count, generalGameData };
    })
  );
  const combinedResult = results.reduce(
    (accumulator, currentResult) => {
      const updatedChartData = {
        "Deaths if you had light armor":
          accumulator.ChartData["Deaths if you had light armor"] +
          currentResult.ChartData["Deaths if you had light armor"],
        "Deaths on heavy armor":
          accumulator.ChartData["Deaths on heavy armor"] +
          currentResult.ChartData["Deaths on heavy armor"],
      };

      const updatedCount = accumulator.count + currentResult.count;
      const updatedRounds =
        accumulator.rounds +
        currentResult.generalGameData.scores.teamId +
        currentResult.generalGameData.scores.oppositeTeamId;
      const updatedGameCount = accumulator.gameCount + 1;
      return {
        ChartData: updatedChartData,
        count: updatedCount,
        rounds: updatedRounds,
        gameCount: updatedGameCount,
      };
    },
    {
      ChartData: {
        "Deaths if you had light armor": 0,
        "Deaths on heavy armor": 0,
      },
      count: 0,
      rounds: 0,
      gameCount: 0,
    }
  );

  if (results.length > 1) {
    return combinedResult;
  }

  return { ...combinedResult, generalGameData: results[0].generalGameData };
};

module.exports = { calculateMatches };
