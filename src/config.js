import * as dotenv from "dotenv";

dotenv.config();

const config = {
	DISCORD_TOKEN: process.env.DISCORD_TOKEN,
	DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
	DISCORD_COOKIE_SECRET: process.env.DISCORD_COOKIE_SECRET,
	PORT: process.env.PORT
};

export default config;
