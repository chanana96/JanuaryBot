const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = module.require('fs')
rem = require('../reminders.json')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remindme')
		.setDescription('SETS REMINDERS')
		.addStringOption(option => option.setName('message').setRequired(true).setDescription('what would you like to be reminded of?'))
		.addStringOption(option => option.setName('time').setRequired(true).setDescription('what time should i remind you? in 24h format'))
		.addStringOption(option => option.setName('month').setDescription('which month?')
			.addChoices(
				{ name: 'January', value: 'January' },
				{ name: 'February', value: 'February' },
				{ name: 'March', value: 'March' },
				{ name: 'April', value: 'April' },
				{ name: 'May', value: 'May' },
				{ name: 'June', value: 'June' },
				{ name: 'July', value: 'July' },
				{ name: 'August', value: 'August' },
				{ name: 'September', value: 'September' },
				{ name: 'October', value: 'October' },
				{ name: 'November', value: 'November' },
				{ name: 'December', value: 'December' } ))
		.addStringOption(option => option.setName('day').setDescription('which day?')),
	async execute(interaction){
		if (interaction.commandName === "remindme"){
			let fullDate = new Date().setFullYear(new Date().getFullYear(), months.indexOf(interaction.options.getString('month'))+1, interaction.options.getString('day'));
			let fullDateNextYear = new Date().setFullYear(new Date().getFullYear()+1, months.indexOf(interaction.options.getString('month'))+1, interaction.options.getString('day'));
			let splitTime = interaction.options.getString('time').split(':');
			let hoursAndMinutes = new Date().setHours(parseInt(splitTime[0]), parseInt(splitTime[1]));
			rem[Object.keys(rem).length+1] = {
						channelid: interaction.channel.id,
						time: interaction.options.getString('month') && interaction.options.getString('day') && Date.now()<fullDate ? new Date(fullDate).setHours(splitTime[0]) :
						interaction.options.getString('month') && interaction.options.getString('day') && Date.now()>fullDate? new Date(fullDateNextYear).setHours(splitTime[0]) : //if the given date is less than the current date, add a year
						hoursAndMinutes<Date.now() ? hoursAndMinutes+86400000 : //if the given time is less than the current time, add 24 hours
						hoursAndMinutes,
						id: interaction.user.id,
						msg: interaction.options.getString('message')
				}
			await fs.writeFile('./reminders.json', JSON.stringify(rem, null, 4), err => {
				if(err) throw err;
						
				})
			await interaction.reply('done');
		}
	}
};