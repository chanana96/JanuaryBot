const axios = require("axios");
const { parseUrl } = require("../utils/parseUrl");
const {
  setEntitlementHeaders,
  ssidCookieHeaders,
  AuthCookiesBody,
  AuthRequestBody,
  MultiFactorAuthenticationBody,
  baseURL,
  agent,
} = require("../../../config/valorant/httpConfig");
const { userAgent } = require("../../../config/valorant/httpConfigValues");

let tokens = new Object();

const getCookiesAndAuthorize = async () => {
  const response = await axios.post(baseURL.authURL, AuthCookiesBody, {
    headers: {
      "User-Agent": userAgent,
    },
    httpsAgent: agent,
  });
  return (cookies = response.headers["set-cookie"]);
};

const authorize = async (cookies, login, password) => {
  const response = await axios.put(
    baseURL.authURL,
    AuthRequestBody(login, password),
    {
      headers: ssidCookieHeaders(cookies),
      httpsAgent: agent,
    }
  );

  if (response.data.type === "multifactor") {
    return "multifactor";
  }
  const ssidCookie = response.headers["set-cookie"].find((cookie) =>
    cookie.startsWith("ssid=")
  );

  if (response.data.response && response.data.response.parameters) {
    return (tokens = {
      ...tokens,
      ...parseUrl(response.data.response.parameters.uri),
      ssid: ssidCookie ? ssidCookie.split(";")[0].split("=")[1] : null,
    });
  } else {
    throw new Error("Parameters not found in response");
  }
};

const multifactor = async (interaction) => {
  try {
    const collectorFilter = (m) => m.author.id === interaction.user.id;
    let timeRemaining = 60;

    await interaction.reply({
      content: `Please type out your multifactor authentication code.\nTime remaining: ${timeRemaining} seconds.`,
      fetchReply: true,
      ephemeral: true,
    });
    const updateInterval = 1; // Update the timer every second
    const timer = setInterval(async () => {
      timeRemaining -= updateInterval;
      if (timeRemaining <= 0) {
        clearInterval(timer);
      } else {
        await interaction.editReply(
          `Please type out your multifactor authentication code.\nTime remaining: ${timeRemaining} seconds.`
        );
      }
    }, updateInterval * 1000);

    const collector = await interaction.channel.awaitMessages({
      filter: collectorFilter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    clearInterval(timer);
    await interaction.deferReply();
    return await collector.first().content;
  } catch (error) {
    console.log("error:");
    console.log(error);
    if (error.code === "TIME") {
      await interaction.editReply({
        content: "You ran out of time.. :(",
        ephemeral: true,
      });
      throw error;
    }
    await interaction.editReply({
      content: "There was an issue with your authentication code!",
      ephemeral: true,
    });
    throw error;
  }
};

const handleMultifactor = async (interaction, cookies) => {
  const multifactorCode = await multifactor(interaction);
  //   if (multifactorCode instanceof Error) {
  //     console.error(multifactorCode);
  //     await interaction.reply(
  //       "There was an error! Please make sure your login details are correct"
  //     );
  //     return;
  //   }
  const response = await axios.put(
    baseURL.authURL,
    MultiFactorAuthenticationBody(multifactorCode),
    { headers: ssidCookieHeaders(cookies), httpsAgent: agent }
  );
  console.log(response);
  const ssidCookie = response.headers["set-cookie"].find((cookie) =>
    cookie.startsWith("ssid=")
  );

  if (response.data.response && response.data.response.parameters) {
    return {
      ...tokens,
      ...parseUrl(response.data.response.parameters.uri),
      ssid: ssidCookie ? ssidCookie.split(";")[0].split("=")[1] : null,
    };
  } else {
    throw new Error("Parameters not found in response");
  }
};

const setTokenEntitlement = async (tokens) => {
  const entitlements = (
    await axios.post(
      baseURL.setEntitlements,
      {},
      {
        headers: setEntitlementHeaders(tokens),
        httpsAgent: agent,
      }
    )
  ).data.entitlements_token;
  return { ...tokens, entitlements };
};

const setTokens = async (login, password, interaction) => {
  const cookies = await getCookiesAndAuthorize();
  let tokens = await authorize(cookies, login, password);
  if (tokens === "multifactor") {
    tokens = await handleMultifactor(interaction, cookies);
  }
  //   if (tokens instanceof Error) {
  //     return tokens;
  //   }
  return setTokenEntitlement(tokens);
};

module.exports = { setTokens, setTokenEntitlement, handleMultifactor };
