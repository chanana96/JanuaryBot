const axios = require("axios");
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const { setTokens } = require("../valAuthApi/TokenAPI");
const { createGraph } = require("./FnaticGraph");
const { loopData } = require("./LoopMatchData");
const { calculateMatches } = require("./CalculateMatches");
const { getMap } = require("./FnaticAPIutils");
const { getUserDataHenrikApi } = require("../utils/getUserDataHenrikApi");
const {
  baseURL,
  agent,
  requestHeaders,
} = require("../../../config/valorant/httpConfig");
const {
  DUMMY_RIOT_USERNAME: dummyUsername,
  DUMMY_RIOT_PASSWORD: dummyPassword,
} = process.env;

const getMatchIDs = async (tokens, region, puuid) => {
  try {
    return (
      await axios.get(
        `${baseURL.playerData(
          region
        )}match-history/v1/history/${puuid}?startIndex={startIndex}&endIndex=25&queue=competitive`,
        {
          headers: requestHeaders(tokens),
          httpsAgent: agent,
        }
      )
    ).data.History;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = async ({
  interaction,
  barChartImageBuffer,
  resultData: {
    gameCount,
    rounds,
    count,
    ChartData,
    generalGameData: {
      scores: { teamId, oppositeTeamId } = {},
      minutes,
      seconds,
      mapData,
    } = {},
  },
  username,
  tag,
  matches_to_aggregate,
}) => {
  const data = {
    light: ChartData["Deaths if you had light armor"],
    heavy: ChartData["Deaths on heavy armor"],
    savedMoney: count,
    buyRoundTranslation: (count / 3300).toFixed(1),
    totalRounds: rounds,
    gameCount: gameCount,
    username: username,
    tag: tag,
  };

  const percentage = ((data.light / data.heavy) * 100).toFixed(2);

  const attachment = new AttachmentBuilder(barChartImageBuffer, {
    name: "bar-chart.png",
  });

  let author = {
    name: `${data.username}#${data.tag}`,
  };
  const embed = new EmbedBuilder()
    .setAuthor(author)
    .setDescription(
      `${
        data.gameCount < matches_to_aggregate
          ? `Unfortunately, you didn't have enough valid matches to aggregate. However!`
          : ""
      }
	  You would've saved **${data.savedMoney} credits**. That translates to **${
        data.buyRoundTranslation
      }** extra light buy rounds in your ${
        minutes
          ? `**${data.totalRounds} round** game!`
          : `${data.gameCount} games(${data.totalRounds} rounds)!`
      }`
    )
    .addFields(
      {
        name: "Times you survived with less than 25 hp:",
        value: data.light.toString(),
      },
      {
        name: "Times you died on heavy armor:",
        value: data.heavy.toString(),
      },
      {
        name: "Theoretical light armor death percentage:",
        value: `${percentage}%`,
      }
    )
    .setImage("attachment://bar-chart.png");
  if (minutes !== undefined) {
    author = {
      name: `${data.username}#${
        data.tag
      } - ${mapData.name.toString()}  ${teamId}:${oppositeTeamId}`,
    };
    embed
      .setAuthor(author)
      .setTitle(`${minutes}m ${seconds}s`)
      .setThumbnail(mapData.icon);
  }

  await interaction.editReply({ embeds: [embed], files: [attachment] });
};

const getData = async (interaction, matches_to_aggregate, username, tag) => {
  try {
    await interaction.deferReply();
    const { region, puuid } = await getUserDataHenrikApi(username, tag);
    const tokens = await setTokens(dummyUsername, dummyPassword);
    const matchIDs = await getMatchIDs(tokens, region, puuid);
    console.time("loopData");
    const matchData = await loopData({
      // concurrently gets match data and filters them
      tokens,
      matchIDs,
      matches_to_aggregate,
      region,
      puuid,
    });
    console.timeEnd("loopData");
    console.time("everything else");
    const mapData = await getMap(matchData);
    const resultData = await calculateMatches(matchData, puuid, mapData);

    const barChartImageBuffer = await createGraph(resultData.ChartData);
    await sendMessage({
      interaction,
      barChartImageBuffer,
      resultData,
      username,
      tag,
      matches_to_aggregate,
    });
    console.timeEnd("everything else");
  } catch (error) {
    console.error(error);
    interaction.editReply(
      "There was an error! Please make sure the username and tag is correct"
    );
  }
};

module.exports = { getData };
