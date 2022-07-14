const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('members')
				.setDescription('TELLS YOU HOW MANY MEMBERS THERE ARE'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('createdat')
				.setDescription('TELLS YOU THE BIRTHDAY OF THE SERVER'))
		.addSubcommand(subcommand => 
			subcommand
				.setName('ownerid')
				.setDescription('TELLS YOU THE USER ID OF THE OWNER OF THIS SERVER')),
	async execute(interaction){
		if (interaction.options.getSubcommand() === "members"){
			await interaction.reply(`THERE ARE ${interaction.guild.memberCount} USERS IN THE SERVER!`);
		}
		else if (interaction.options.getSubcommand() === "createdat"){
			await interaction.reply(`THIS SERVER WAS BORN ON ${interaction.guild.createdAt}!`);
		} else if (interaction.options.getSubcommand() ==="ownerid"){
			await interaction.reply(`THE USER ID OF THIS SERVER IS ${interaction.guild.ownerId}`)
		} else{
			await interaction.reply({content: 'NO SUB COMMAND WAS USED!', ephemeral: true});
		}
	}
};