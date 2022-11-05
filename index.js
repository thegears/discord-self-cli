const inquirer = require("inquirer");
const fetch = require("node-fetch");
const { Client } = require('discord.js-selfbot-v13');
const client = new Client({
	checkUpdate: false
});
inquirer.registerPrompt('search-list', require('inquirer-search-list'));
const token = "";

let dmuser;

client.login(token);

(async () => {

	let friendsReq = await fetch("https://discord.com/api/v9/users/@me/relationships", {
		headers: {
			"Authorization": token
		}
	});

	friendsReq = await friendsReq.json();

	let friends = friendsReq.map(f => ({
		name: `${f.user.username}#${f.user.discriminator}`,
		value: f.id
	}));

	client.on("ready", async () => {
		await console.clear();
		inquirer.prompt(
			{
				type: 'search-list',
				message: "Select",
				name: "user",
				choices: friends
			})
			.then(async (answers) => {
				console.clear();

				var readline = require('readline');
  
				var rl = readline.createInterface(
					process.stdin, process.stdout);



				rl.on('line', (input) => {
					if(input) client.users.cache.get(answers.user).send({
						content: input
					});
				});

				client.on("messageCreate", (message) => {
					if (message.channel.type == "DM" && message.author.id == answers.user) {
						console.log(`${message.author.username}: ${message.content}`);
					};
				});
			});
	});
})();
