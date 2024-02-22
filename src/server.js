import cookieParser from "cookie-parser";
import express from "express";

import config from "./config.js";
import * as discord from "./discord.js";
import * as microsoft from "./microsoft.js";
import * as mongo from "./db-methods.js";

const app = express();
app.use(cookieParser(config.COOKIE_SECRET)); // Used for signing cookies

const client = mongo.connect(config.MONGO_URI);
await client.connect();

console.log("Connected to MongoDB");

app.get("/", (_, res) => {
	res.sendFile("index.html", { root: "./public" });
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

		const token = await discord.getOAuthToken(code);
		const userData = await discord.getUserData(token);
		const { state, url } = microsoft.getOAuthUrl();

		console.log(`Discord user ID is ${userData.user.id}`);

		res.cookie("clientState", state, { maxAge: 1000 * 60 * 10, signed: true });
		res.cookie("discordUserID", userData.user.id, { maxAge: 1000 * 60 * 10, signed: true });
		res.redirect(url);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.get("/microsoft-callback", async (req, res) => {
	try {
		const code = req.query.code;
		const microsoftState = req.query.state;
		const { clientState, discordUserID } = req.signedCookies;

		if (clientState != microsoftState) {
			console.error("States don't match, aborting...");

			return res.sendStatus(403);
		}

		const token = await microsoft.getOAuthToken(code);
		const userData = await microsoft.getUserData(token);

		console.log(`Microsoft user ID is ${userData.sub}`);

		if (await mongo.isAlreadyRegistered(client, discordUserID, userData.sub)) {
			return res.send("You already have an account linked!");
		}

		await mongo.addUser(client, discordUserID, userData.sub);

		// Clear all cookies
		res.clearCookie("clientState");
		res.clearCookie("discordUserID");

		res.send("Success! You can close this tab now.");
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.listen(config.PORT, () => console.log(`App listening on http://localhost:${config.PORT}`));
