import { MongoClient, ServerApiVersion } from "mongodb";

export function connect(uri) {
	return new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true
		}
	});
}

export async function addUser(client, discordID, microsoftID) {
	const users = client.db("auth").collection("auth");

	await users.insertOne({
		discordID,
		microsoftID,
		isBanned: false
	});
}

export async function isAlreadyRegistered(client, discordID, microsoftID) {
	const users = client.db("auth").collection("auth");

	const discordUser = await users.findOne({ discordID });
	const microsoftUser = await users.findOne({ microsoftID });

	return discordUser || microsoftUser;
}

export async function disconnect(client) {
	await client.close();
}
