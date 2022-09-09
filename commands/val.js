const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { InteractionResponseType } = require('discord-api-types/v9');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('val')
		.setDescription('VARIOUS VALORANT RELATED COMMANDS!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('level')
				.setDescription('TELLS YOU WHAT LEVEL THE SPECIFIED USER IS!')
				.addStringOption(option => option.setName('username').setRequired(true).setDescription('your valorant username'))
				.addStringOption(option => option.setName('tag').setRequired(true).setDescription('your valorant tag'))
				)
		.addSubcommand(subcommand =>
			subcommand
				.setName('elo')
				.setDescription('TELLS YOU WHAT ELO THE SPECIFIED USER IS AT, ALONG WITH HOW MUCH THEY NEED FOR THEIR NEXT RANKUP!')
				.addStringOption(option => option.setName('username').setRequired(true).setDescription('your valorant username'))
				.addStringOption(option => option.setName('tag').setRequired(true).setDescription('your valorant tag')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('card')
				.setDescription('SHOWS YOU YOUR PLAYER CARD, MUST SPECIFY CARD SIZE')
				.addStringOption(option => option.setName('username').setRequired(true).setDescription('your valorant username'))
				.addStringOption(option => option.setName('tag').setRequired(true).setDescription('your valorant tag'))
				.addStringOption(option => option.setName('card_size').setRequired(true).setDescription('select a card size')
				.addChoices(
					{ name: 'Large', value: 'large' },
					{ name: 'Small', value: 'small' },
					{ name: 'Wide', value: 'wide' } )
					)),
	async execute(interaction){
		const username = interaction.options.getString('username');
		const tag = interaction.options.getString('tag').split('').filter(char => /[a-zA-Z0-9]/.test(char)).join('');
		const cardSize = interaction.options.getString('card_size');
		
		if (interaction.options.getSubcommand() === "level"){
			await snekfetch.get("https://api.henrikdev.xyz/valorant/v1/account/"+username+"/"+tag)
			.then(r => {interaction.reply(`the user's account level is: ${r.body['data']['account_level']}.`)})
		}
		else if (interaction.options.getSubcommand() === "elo"){
			await snekfetch.get("https://api.henrikdev.xyz/valorant/v1/mmr/ap/"+username+"/"+tag)
			.then( r=> {interaction.reply(`the user's elo is ${r.body['data']['elo']} at ${r.body['data']['currenttierpatched']}`)});
		}
		else if (interaction.options.getSubcommand() === "card"){
			await snekfetch.get("https://api.henrikdev.xyz/valorant/v1/account/"+username+"/"+tag)
 			.then(r => {interaction.reply(r.body['data']['card'][cardSize])});
		}
	}
}