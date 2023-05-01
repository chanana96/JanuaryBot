const RedisClient = require("../../src/api/redisApi/CreateRedisClient");

const displayAllData = async () => {
  const client = await RedisClient.createRedisClient();
  const keys = await client.keys("*");
  console.log("Keys in Redis database:");
  for (const key of keys) {
    const value = await client.get(key);
    console.log(`Key: ${key}, Value: ${value}`);
  }
};
displayAllData();
