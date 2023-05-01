const redis = require("redis");

const createRedisClient = async () => {
  const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
  });
  client.on("error", (err) => {
    console.error("Error in Redis client:", err);
  });
  await client.connect();

  return client;
};

module.exports = { createRedisClient };
