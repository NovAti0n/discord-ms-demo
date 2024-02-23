const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const config = require("./config.js");

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter(f => f.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ("data" in command && "execute" in command)
			commands.push(command.data.toJSON());
		else console.log(`Invalid command file: ${file}`);
	}
}

const rest = new REST().setToken(config.DISCORD_TOKEN);

(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application command(s).`
		);

		const data = await rest.put(
			Routes.applicationCommands(
				config.DISCORD_CLIENT_ID,
				config.DISCORD_GUILD_ID
			),
			{ body: commands }
		);

		console.log(
			`Successfully reloaded ${data.length} application command(s).`
		);
	} catch (err) {
		console.error(err);
	}
})();
