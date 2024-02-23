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

// TODO: Rewrite this function
// export async function banUser(client, user) {
// 	const users = client.db("auth").collection("auth");
// 	const updateDoc = {
// 		$set: {
// 			isBanned: true
// 		}
// 	};

// 	await users.updateMany({ discordUsers: { $in: [user] } }, updateDoc);
// }

// Note : you have to use a replicaSet to use changeStreams https://www.mongodb.com/docs/manual/tutorial/convert-standalone-to-replica-set/
export function getChangeStream(client) {
	const users = client.db("auth").collection("auth");

	return users.watch();
}

export function addCallbackOnChange(client, callback) {
	getChangeStream(client).on("change", callback);
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
