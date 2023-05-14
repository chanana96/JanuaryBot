const {
  getCalendarClient,
} = require("./../config/google/googleCalendarService");
const { event } = require("./../config/google/createCalendarEvent");
const {
  discordRolesForGoogleCalendar,
  pawPatrolCalendarId,
} = require("../config/google/timeConfig");
const { createGuildEvent } = require("./createGuildEvent");
const moment = require("moment");

const matchCheck = async (nonMomentDate, interaction) => {
  const calendarIds = Object.values(discordRolesForGoogleCalendar);
  const client = await getCalendarClient();
  console.log(calendarIds);
  let maxStart = null;
  let minEnd = null;
  let date = moment(nonMomentDate);

  for (let i = 0; i < calendarIds.length; i++) {
    const calendar = await client.calendars.get({ calendarId: calendarIds[i] });
    const calendarTimeZone = calendar.data.timeZone;

    let dateInTimeZone = date.tz(calendarTimeZone);
    let timeMin = dateInTimeZone.startOf("day").toISOString();
    let timeMax = dateInTimeZone
      .clone()
      .add(1, "day")
      .endOf("day")
      .toISOString();
    const response = await client.events.list({
      calendarId: calendarIds[i],
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });
    const events = response.data.items;

    if (events.length === 0) {
      return "Successfully scheduled your time. Not all players have set their times on this date yet.";
    }

    let calendarMaxStart = null;
    let calendarMinEnd = null;

    for (let j = 0; j < events.length; j++) {
      const start = moment.tz(events[j].start.dateTime, calendarTimeZone).utc();
      const end = moment.tz(events[j].end.dateTime, calendarTimeZone).utc();

      if (calendarMaxStart === null || start.isAfter(calendarMaxStart)) {
        calendarMaxStart = start;
      }

      if (calendarMinEnd === null || end.isBefore(calendarMinEnd)) {
        calendarMinEnd = end;
      }
    }

    if (maxStart === null || calendarMaxStart.isAfter(maxStart)) {
      maxStart = calendarMaxStart;
    }

    if (minEnd === null || calendarMinEnd.isBefore(minEnd)) {
      minEnd = calendarMinEnd;
    }
  }

  if (maxStart.isBefore(minEnd)) {
    const timezone = "Asia/Singapore";
    const name = "5 man";
    await createGuildEvent(interaction, maxStart, minEnd, name);

    const eventObject = event(maxStart, minEnd, timezone);
    const client = await getCalendarClient();
    const createdEvent = await client.events.insert({
      calendarId: pawPatrolCalendarId,
      resource: eventObject,
    });

    let duration = Math.round(minEnd.diff(maxStart, "hours"));
    let date = maxStart.format("YYYY-MM-DD");

    return `Successfully scheduled your time. All 5 players are available for ${duration} hours on ${date}. Link: ${createdEvent.data.htmlLink} or type "/schedule view"`;
  } else {
    return "Successfully scheduled your time. All 5 players have set their dates but the players' available times do not overlap.";
  }
};

module.exports = { matchCheck };
