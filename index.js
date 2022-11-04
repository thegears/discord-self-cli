const inquirer = require("inquirer");
const fetch = require("node-fetch");
inquirer.registerPrompt('search-list', require('inquirer-search-list'));
const token = ""

(async () => {

	let arg = process.argv[2];
	if(!arg) return console.log("Please write a arg");
	arg = arg.toLowerCase();

	if (arg == "dm" || arg == "--dm" || arg == "-dm") {
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

		inquirer
			.prompt([
				{
					type: 'search-list',
					message: "Select",
					name: "user",
					choices: friends
				}, {
					message: "Message",
					name: "message",
				},])
			.then(async (answers) => {
				let channelReq = await fetch(`https://discord.com/api/v9/users/@me/channels`, {
					method: "POST",
					headers: {
						"Authorization": token,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"recipient_id": answers.user
					})
				});

				channelReq = await channelReq.json();

				let dmReq = await fetch(`https://discord.com/api/v9/channels/${channelReq.id}/messages`, {
					method: "POST",
					headers: {
						"Authorization": token,
						"content-type": "application/json",
					},
					body: JSON.stringify({
						content: answers.message
					})
				});

				dmReq = await dmReq.json();

				console.log("Sended");
			});
	}else {
		console.warn("Error.")
	};
})();
