const cat = require("countries-and-timezones");
const {
  discordRolesForGoogleCalendar,
} = require("../config/google/timeConfig");
const { setCalendarTimeZone } = require("../config/google/setCalendarTimeZone");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timezone")
    .setDescription("SET YOUR TIMEZONE!!")
    .addStringOption((option) =>
      option
        .setName("country")
        .setDescription("WHERE DO YOU LIVE?")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const countries = cat.getAllCountries();

    const choices = Object.values(countries).map((country) => country.name);
    const filtered = choices.filter((choice) =>
      choice.toLowerCase().includes(focusedValue.toLowerCase())
    );

    let options;
    if (filtered.length > 25) {
      options = filtered.slice(0, 25);
    } else {
      options = filtered;
    }
    await interaction.respond(
      options.map((choice) => ({ name: choice, value: choice }))
    );
  },
  async execute(interaction) {
    let inputCountry = interaction.options.getString("country");
    let countryInfo = Object.values(cat.getAllCountries()).find(
      (country) => country.name === inputCountry
    );
    let timezone = cat.getTimezonesForCountry(countryInfo.id)[0].name;
    try {
      const memberRoles = interaction.member.roles.cache;
      const role = memberRoles.find((role) =>
        Object.keys(discordRolesForGoogleCalendar).includes(role.name)
      ).name;
      await setCalendarTimeZone(discordRolesForGoogleCalendar[role], timezone);
      await interaction.reply(`Successfully set your timezone to ${timezone}.`);
    } catch (error) {
      console.error(`Error: ${error}`);
      await interaction.reply("Failed to set your timezone.");
    }
  },
};
