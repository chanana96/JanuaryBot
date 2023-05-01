const RedisClient = require("../../src/api/redisApi/CreateRedisClient");

const deleteKey = async (keyToDelete) => {
  const client = await RedisClient.createRedisClient();
  const result = await client.del(keyToDelete);
  if (result === 1) {
    console.log(`Key "${keyToDelete}" has been deleted.`);
  } else {
    console.log(`Key "${keyToDelete}" not found or already deleted.`);
  }
};

deleteKey("103826386174644224");
