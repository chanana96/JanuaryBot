require("dotenv").config();
const redis = require("redis");

const createRedisClient = async () => {
  let client;
  if (process.env.REDIS_URL) {
    client = redis.createClient(process.env.REDIS_URL);
  } else {
    client = redis.createClient({
      host: "127.0.0.1",
      port: 6379,
    });
  }

  client.on("error", (err) => {
    console.error("Error in Redis client:", err);
  });

  await client.connect();

  return client;
};

module.exports = { createRedisClient };
