const { getCalendarClient } = require("./googleCalendarService");

const setCalendarTimeZone = async (calendarId, timeZone) => {
  const calendarClient = await getCalendarClient();

  const calendar = await calendarClient.calendars.get({ calendarId });

  calendar.data.timeZone = timeZone;

  await calendarClient.calendars.update({
    calendarId,
    requestBody: calendar.data,
  });
};

module.exports = { setCalendarTimeZone };
