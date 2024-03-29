import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const config = {
	DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
	DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
	MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
	MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
	MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
	MICROSOFT_REDIRECT_URI: process.env.MICROSOFT_REDIRECT_URI,
	MONGO_URI: process.env.MONGO_URI,
	COOKIE_SECRET: process.env.COOKIE_SECRET,
	PORT: process.env.PORT
};

export default config;
