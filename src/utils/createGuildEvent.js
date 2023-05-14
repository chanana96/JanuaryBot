const createGuildEvent = async (interaction, startTime, endTime, name) => {
  const voiceChannel = await interaction.guild.channels.cache
    .filter((c) => c.type === 2)
    .firstKey();

  const guildScheduledEventData = {
    name: name,
    scheduledStartTime: startTime,
    scheduled_end_time: endTime,
    privacyLevel: 2,
    entityType: 2,
    channel: voiceChannel,
  };
  await interaction.guild.scheduledEvents.create(guildScheduledEventData);
};

module.exports = { createGuildEvent };
