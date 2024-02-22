import crypto from "crypto";
import { fetch } from "undici";

import config from "./config.js";

export function getOAuthUrl() {
	const state = crypto.randomUUID();

	const url = new URL("https://discord.com/api/oauth2/authorize");
	url.searchParams.set("client_id", config.DISCORD_CLIENT_ID);
	url.searchParams.set("redirect_uri", config.DISCORD_REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("state", state);
	url.searchParams.set("scope", "identify");
	url.searchParams.set("prompt", "consent");

	return { state, url: url.toString() };
}

export async function getOAuthToken(code) {
	const url = "https://discord.com/api/v10/oauth2/token";
	const body = new URLSearchParams({
		client_id: config.DISCORD_CLIENT_ID,
		client_secret: config.DISCORD_CLIENT_SECRET,
		grant_type: "authorization_code",
		code,
		redirect_uri: config.DISCORD_REDIRECT_URI
	});

	const response = await fetch(url, {
		body,
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else throw new Error(`Unable to fetch Discord OAuth token: [${response.status}] ${response.statusText}`);
}

export async function getUserData(token) {
	const url = "https://discord.com/api/v10/oauth2/@me";

	const response = await fetch(url, {
		headers: {
			Authorization: `${token.token_type} ${token.access_token}`
		}
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else throw new Error(`Unable to fetch user data: [${response.status}] ${response.statusText}`);
}
