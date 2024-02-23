# Discord/Microsoft OAuth Demo

Code heavily inspired by [Discord's linked roles example](https://github.com/discord/linked-roles-sample)

## Setup

Create a `.env` file at the root and paste the following content in:

```
DISCORD_TOKEN=<Your Discord bot token>
DISCORD_GUILD_ID=<Your Discord guild ID>
DISCORD_VERIFIED_ROLE_ID=<Your verified role ID>
DISCORD_CLIENT_ID=<Your Discord client/application ID>
DISCORD_CLIENT_SECRET=<Your Discord client secret (OAuth)>
DISCORD_REDIRECT_URI="http://localhost:3000/discord-callback"

MICROSOFT_TENANT_ID=<Your Microsoft tenant ID>
MICROSOFT_CLIENT_ID=<Your client/application ID>
MICROSOFT_CLIENT_SECRET=<Your client secret>
MICROSOFT_REDIRECT_URI="http://localhost:3000/microsoft-callback"

MONGO_URI=<Your MongoDB connection string>

COOKIE_SECRET=<A randomly generated UUID (use crypto.randomUUID() in a Node shell)>
PORT=3000
```

Once this is done, you need to start both programs. The following examples use [pnpm](https://pnpm.io). Since it's a drop in replacement for `npm`, you can use the following commands with `npm`.

Install the dependencies and run the server using:

```sh
cd server
pnpm i
pnpm start
```

Install the dependencies and run the bot using:

```sh
cd bot
pnpm i
pnpm start
```
