require("dotenv").config();

const discordRolesForGoogleCalendar = JSON.parse(process.env.PLAYER_CALENDARS);
const pawPatrolCalendarId = process.env.PAWPATROL_CALENDAR;

module.exports = { discordRolesForGoogleCalendar, pawPatrolCalendarId };
