const event = (startTime, endTime, timezone, summary = "Available time") => ({
  summary: summary,
  start: {
    dateTime: startTime,
    timeZone: timezone,
  },
  end: {
    dateTime: endTime,
    timeZone: timezone,
  },
});

module.exports = { event };
