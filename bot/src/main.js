const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { MongoClient } = require("mongodb");
const config = require("./config.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const mongoClient = new MongoClient(config.MONGO_URI);

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
			client.commands.set(command.data.name, command);
		else console.log(`Invalid command file: ${file}`);
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	if (event.once)
		client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

const changeStream = mongoClient.db("auth").collection("auth").watch();

changeStream.on("change", async change => {
	if (change.operationType !== "insert") return;

	const userId = change.fullDocument.discordID;
	const guild = await client.guilds.fetch(config.DISCORD_GUILD_ID);
	const member = await guild.members.fetch(userId);

	console.log(member);

	const role = guild.roles.cache.get(config.DISCORD_VERIFIED_ROLE_ID);

	await member.roles.add(role);

	console.log(`Verification complete for user ${userId}!`);
});

client.login(config.DISCORD_TOKEN);
