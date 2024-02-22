import cookieParser from "cookie-parser";
import express from "express";

import config from "./config.js";
import * as discord from "./discord.js";

const app = express();
app.use(cookieParser(config.DISCORD_COOKIE_SECRET)); // Used for signing cookies

app.get("/", (_, res) => {
	res.send("🫡");
});

app.get("/verify", async (_, res) => {
	const { state, url } = discord.getOAuthUrl();

	res.cookie("clientState", state, { maxAge: 1000 * 60 * 10, signed: true });
	res.redirect(url);
});

app.get("/discord-callback", async (req, res) => {
	try {
		const code = req.query.code;
		const discordState = req.query.state;
		const { clientState } = req.signedCookies;

		if (clientState != discordState) {
			console.error("States don't match, aborting...");

			return res.sendStatus(403);
		}

		console.log("State validation successful");

		const token = await discord.getOAuthToken(code);
		const userData = await discord.getUserData(token);

		console.log(`User ID is ${userData.user.id}`);

		res.send(`Hello ${userData.user.username}`);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.listen(config.PORT, () => console.log(`App listening on http://localhost:${config.PORT}`));
