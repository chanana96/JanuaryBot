const moment = require("moment-timezone");

const convertToDate = (start_time, end_time, day, timezone) => {
  let startDate, endDate;
  day = day.toLowerCase();

  start_time = moment(start_time, ["h:mma", "h:mm a", "H", "ha", "h a"]);
  end_time = moment(end_time, ["h:mma", "h:mm a", "H", "ha", "h a"]);

  if (!start_time.isValid() || !end_time.isValid()) {
    throw new Error("Invalid time format");
  }

  start_time = start_time.format("HH:mm");
  end_time = end_time.format("HH:mm");

  if (isNaN(day)) {
    startDate = moment().tz(timezone).day(day);
    endDate = moment().tz(timezone).day(day);

    const now = moment().tz(timezone);
    const startTimeToday = moment()
      .tz(timezone)
      .hour(parseInt(start_time.split(":")[0]))
      .minute(parseInt(start_time.split(":")[1]));

    let isSameDay = moment().tz(timezone).isSame(startDate, "day");
    if (
      (isSameDay && now.isAfter(startTimeToday)) ||
      (!isSameDay && startDate.isBefore(now, "day"))
    ) {
      startDate.add(1, "week");
      endDate.add(1, "week");
    }

    if (end_time <= start_time) {
      endDate.add(1, "day");
    }
  } else {
    const currentDay = moment().tz(timezone).date();
    const currentYearMonth = moment().tz(timezone).format("YYYY-MM");
    const nextMonth = moment().tz(timezone).add(1, "months").format("YYYY-MM");

    if (parseInt(day) < currentDay) {
      // If the input day has passed in the current month, use next month instead
      startDate = moment(`${nextMonth}-${day.padStart(2, "0")}`);
    } else {
      startDate = moment(`${currentYearMonth}-${day.padStart(2, "0")}`);
    }

    if (!startDate.isValid()) {
      throw new Error("Invalid day");
    }

    if (end_time <= start_time) {
      endDate = moment(startDate).add(1, "days");
    } else {
      endDate = moment(startDate);
    }
  }

  let start = `${startDate.format("YYYY-MM-DD")}T${start_time}:00${moment(
    startDate
  )
    .tz(timezone)
    .format("Z")}`;
  let end = `${endDate.format("YYYY-MM-DD")}T${end_time}:00${moment(endDate)
    .tz(timezone)
    .format("Z")}`;

  return { start: start, end: end };
};

module.exports = { convertToDate };
