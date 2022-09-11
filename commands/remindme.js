const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = module.require('fs')
rem = require('../reminders.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remindme')
		.setDescription('SETS REMINDERS')
		.addStringOption(option => option.setName('message').setRequired(true).setDescription('what would you like to be reminded of?'))
		.addStringOption(option => option.setName('time').setRequired(true).setDescription('what time should i remind you? include AM/PM'))
		.addStringOption(option => option.setName('month').setDescription('which month?'))
		.addStringOption(option => option.setName('day').setDescription('which day?')),
	async execute(interaction){
		if (interaction.commandName === "remindme"){
			let splitTime = interaction.options.getString('time').split(':');
			let hoursAndMinutes = new Date().setHours(parseInt(splitTime[0]), parseInt(splitTime[1]));
			rem[Object.keys(rem).length+1] = {
						channelid: interaction.channel.id,
						time: hoursAndMinutes<Date.now() ? hoursAndMinutes+86400000 : hoursAndMinutes,
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


// const fs = module.require('fs')

// module.exports.run = async(client, message, args)=>{
// 	let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
// 	let commands = {'m':'minute(s)', '':'second(s)', 'h':'hour(s)', 'd':'day(s)'}
// 	let splitArr = args[0].split(/(\d+)/)
// 	console.log(splitArr)
// 	if(!Object.keys(commands).includes(splitArr[2]) && !months.includes(splitArr[0].toLowerCase())){message.channel.send('invalid syntax says beebo. try d for days, h for hours, m for minutes and nothing for seconds.'); return}
// 	client.reminders[Object.keys(client.reminders).length+1] = {
// 		channelid: message.channel.id,
// 		time: splitArr[2]=='' ? Date.now() + parseInt(splitArr[1]) * 1000 
// 		: splitArr[2]=='m' ? Date.now() + parseInt(splitArr[1]) * 60000 
// 		: splitArr[2]=='h' ? Date.now() + parseInt(splitArr[1]) * (60000*60)
// 		: months.includes(splitArr[0].toLowerCase())
// 		 ? (new Date().setFullYear(new Date().getFullYear(), months.indexOf(args[0].toLowerCase()), args[1])<Date.now() ? new Date().setFullYear(new Date().getFullYear()+1, months.indexOf(args[0]), args[1])
// 		 	 : new Date().setFullYear(new Date().getFullYear(), months.indexOf(args[0].toLowerCase()), args[1])) 
// 		: Date.now() + parseInt(splitArr[1]) * (3600000*24),
// 		id: message.author.id,
// 		msg: months.includes(splitArr[0].toLowerCase()) ? args.slice(2).join(' ') : args.slice(1).join(' ')
// 	}
// 	let seconds = Math.round(((client.reminders[Object.keys(client.reminders).length].time - Date.now())/1000)*100)/100
// 	message.channel.send(`beebo will remind you in ${seconds<60 ? seconds + ' seconds' 
// 		: seconds<3600 ? Math.round((seconds/60)*100)/100 + ' minutes' 
// 		: seconds<86400 ? Math.round(((seconds/60)/60)*100)/100 + ' hours' 
// 		: (Math.round(((seconds/60)/60)*100)/100)/24 + ' days'} do not worry.`)
// 	await fs.writeFile('./reminders.json', JSON.stringify(client.reminders, null, 4), err => {
// 		if(err) throw err;

// 	})
// }

// module.exports.help = {
// 	name: "remindme"
// }