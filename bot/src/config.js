const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

module.exports = {
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
	DISCORD_VERIFIED_ROLE_ID: process.env.DISCORD_VERIFIED_ROLE_ID,
	DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
	MONGO_URI: process.env.MONGO_URI
};
