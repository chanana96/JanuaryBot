const {
  discordRolesForGoogleCalendar,
} = require("../config/google/timeConfig");
const {
  getCalendarClient,
} = require("./../config/google/googleCalendarService");
const { event } = require("./../config/google/createCalendarEvent");
const { convertToDate } = require("./../utils/convertToDate");
const { matchCheck } = require("./../utils/scheduleMatch");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("WHAT TIME ARE YOU FREE?")
    .addStringOption((option) =>
      option
        .setName("start_time")
        .setRequired(true)
        .setDescription("eg. x am/pm")
    )
    .addStringOption((option) =>
      option.setName("end_time").setRequired(true).setDescription("eg. x am/pm")
    )
    .addStringOption((option) =>
      option
        .setName("day")
        .setRequired(true)
        .setDescription("day of the week or day of the month (eg. monday/13)")
    ),
  async execute(interaction) {
    //get player number
    const memberRoles = interaction.member.roles.cache;
    const role = memberRoles.find((role) =>
      Object.keys(discordRolesForGoogleCalendar).includes(role.name)
    ).name;

    //exception handling
    if (!role) {
      await interaction.reply("THIS ROLE IS ONLY FOR PEOPLE IN A TEAM.");
      return;
    }
    //get values from input
    let start_time = interaction.options.getString("start_time");
    let end_time = interaction.options.getString("end_time");
    let day = interaction.options.getString("day");

    try {
      await interaction.deferReply();
      //init client
      const client = await getCalendarClient();
      const calendarId = discordRolesForGoogleCalendar[role];
      const calendar = await client.calendars.get({ calendarId });
      const timezone = calendar.data.timeZone;
      //get start and end date values in users timezone
      let { start, end } = convertToDate(start_time, end_time, day, timezone);
      //init object for google calendar
      const eventObject = event(start, end, timezone);

      await client.events.insert({
        calendarId: calendarId,
        resource: eventObject,
      });

      //check if all 5 players have matching times

      const result = await matchCheck(start, interaction);
      await interaction.editReply(result);
    } catch (error) {
      console.error(`Error: ${error}`);
      await interaction.editReply(
        "Failed to schedule your time. Maybe invalid time or date?"
      );
    }
  },
};
