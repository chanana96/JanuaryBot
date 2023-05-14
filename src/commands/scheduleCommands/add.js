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
  .setName("add")
  .setDescription("ADD AN EVENT TO THE TEAM CALENDAR")
  .addStringOption((option) =>
    option.setName("start_time").setRequired(true).setDescription("eg. x am/pm")
  )
  .addStringOption((option) =>
    option.setName("end_time").setRequired(true).setDescription("eg. x am/pm")
  )
  .addStringOption((option) =>
    option
      .setName("day")
      .setRequired(true)
      .setDescription("day of the week or day of the month (eg. monday/13)")
  )
  .addStringOption((option) =>
    option
      .setName("description")
      .setRequired(true)
      .setDescription("description of the event")
  );

async function execute(interaction) {
  const memberRoles = interaction.member.roles.cache;
  const role = memberRoles.find((role) =>
    Object.keys(discordRolesForGoogleCalendar).includes(role.name)
  ).name;

  if (!role) {
    await interaction.reply("THIS ROLE IS ONLY FOR PEOPLE IN A TEAM.");
    return;
  }
  let start_time = interaction.options.getString("start_time");
  let end_time = interaction.options.getString("end_time");
  let day = interaction.options.getString("day");
  let description = interaction.options.getString("description");
  let timezone = "Asia/Singapore";
  try {
    let { start, end } = convertToDate(start_time, end_time, day);
    const client = await getCalendarClient();

    const eventObject = event(start, end, timezone, description);

    const createdEvent = await client.events.insert({
      calendarId: pawPatrolCalendarId,
      resource: eventObject,
    });

    await interaction.reply(
      `Successfully scheduled event: ${createdEvent.data.htmlLink}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    await interaction.reply(
      "Failed to schedule your event. Maybe invalid time or date?"
    );
  }
}

module.exports = { data, execute };
