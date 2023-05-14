const { google } = require("googleapis");
const key = require("./service-account.json");

const getCalendarClient = () => {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ["https://www.googleapis.com/auth/calendar"],
      null
    );

    jwtClient.authorize(function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const calendar = google.calendar({ version: "v3", auth: jwtClient });
        resolve(calendar);
      }
    });
  });
};

module.exports = { getCalendarClient };
