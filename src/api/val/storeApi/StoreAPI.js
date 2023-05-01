const axios = require("axios");
const Discord = require("discord.js");

const { createCanvas, loadImage } = require("canvas");
const {
  requestHeaders,
  baseURL,
  agent,
} = require("../../../config/valorant/httpConfig");
const { skinCostCode } = require("../../../config/valorant/config");
const { getData } = require("../valAuthApi/CookieReauth");
const { authCheck } = require("../utils/AuthCheck");

const setOfferIDs = async (tokens, puuid, region) => {
  const OfferIDs = (
    await axios.get(
      `${baseURL.playerData(region)}store/v2/storefront/${puuid}`,
      {
        headers: requestHeaders(tokens),
        httpsAgent: agent,
      }
    )
  ).data.SkinsPanelLayout.SingleItemStoreOffers.map(({ OfferID, Cost }) => ({
    OfferID,
    Cost,
  }));
  return OfferIDs;
};

const createImageCollage = async (skins) => {
  const images = await Promise.all(
    skins.map((skin) => loadImage(skin.displayIcon))
  );

  const maxWidth = Math.max(...images.map((img) => img.width));
  const maxHeight = Math.max(...images.map((img) => img.height));

  const canvas = createCanvas(maxWidth * skins.length, maxHeight);
  const ctx = canvas.getContext("2d");

  images.forEach((img, index) => {
    ctx.drawImage(img, maxWidth * index, 0, img.width, img.height);
  });

  return canvas.toBuffer();
};

const showStore = async (interaction, OfferIDs) => {
  let skins = new Array();
  for (const skinData of OfferIDs) {
    const { displayName, displayIcon } = (
      await axios.get(
        `${baseURL.valorantApi}weapons/skinlevels/${skinData.OfferID}`
      )
    ).data.data;
    skins = [
      ...skins,
      {
        displayName,
        displayIcon,
        cost: skinData.Cost[skinCostCode],
      },
    ];
  }

  const imageBuffer = await createImageCollage(skins);
  const attachment = new Discord.MessageAttachment(imageBuffer, "collage.png");
  const embed = new Discord.MessageEmbed()
    .setTitle("Your daily store")
    .addFields({
      name: "Skin and price",
      value: skins
        .map((skin) => `${skin.displayName} - ${skin.cost} RP`)
        .join("\n"),
    })
    .setImage("attachment://collage.png");

  await interaction.editReply({ embeds: [embed], files: [attachment] });
};

async function getDailyStore(interaction) {
  try {
    await interaction.deferReply();
    const { puuid, region, ssid } = await authCheck(interaction);
    const tokens = await getData(ssid);
    const OfferIDs = await setOfferIDs(tokens, puuid, region);
    const message = await showStore(interaction, OfferIDs);
    return message;
  } catch (error) {
    throw error;
  }
}

module.exports = { getDailyStore };
