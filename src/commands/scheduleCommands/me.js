const {
  discordRolesForGoogleCalendar,
  pawPatrolCalendarId,
} = require("../../config/google/timeConfig");
const {
  getCalendarClient,
} = require("../../config/google/googleCalendarService");
const { event } = require("../../config/google/createCalendarEvent");
const { convertToDate } = require("../../utils/convertToDate");
const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

const data = new SlashCommandSubcommandBuilder()
  .setName("me")
  .setDescription("VIEW AND MODIFY YOUR OWN SCHEDULE");

async function execute(interaction) {}

module.exports = { data, execute };
