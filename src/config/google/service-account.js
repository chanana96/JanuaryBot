require("dotenv").config();
let key = JSON.parse(process.env.SERVICE_ACCOUNT);
key.private_key = key.private_key.replace(/\\n/g, "\n");
module.exports = { key };
