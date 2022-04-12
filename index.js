const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });
const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');

client.on('ready', () => {
	console.log(`${client.user.tag} olarak bağlanıldı`);
	const commandData = new SlashCommandBuilder()
	.setName('kur')
	.setDescription('dolar-tl veya euro-tl kurunu görürsünüz')
	.addStringOption(o => o.setName('kur').setDescription('kur adı belirtin').setRequired(true).addChoice('dolar', 'dolar-tl kuru').addChoice('euro', 'euro-tl kuru'));
	client.guilds.cache.forEach(guild => {
		guild.commands.create(commandData);
	});
});

client.on('interactionCreate', interaction => {
	if(!interaction.isCommand()) return;
	if(interaction.commandName !== 'kur') return;
	var kur = interaction.options.getString('kur');
	let symbol;
	if(kur.startsWith('dolar')){
		symbol = 'dollar';
	} else {
		symbol = 'euro';
	}
	axios.get(`https://kaitoapi.skysea28957.repl.co/?symbol=${symbol}&api=currency`).then(res => {
		interaction.reply({ content: `Şu an ki kur ile 1 ${kur}, ${res.data} kadar türk lirasına eşit!\n*veriler [google](<https://www.google.com>) dan alınmıştır*` });
  }).catch(e => {
	  interaction.reply({ content: e, ephemeral: true });
  });
});

client.login(require('./token.json').token);
