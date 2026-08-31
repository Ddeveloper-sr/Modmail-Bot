<div align="center">

# Modmail Bot

A modern Discord Modmail bot built with **discord.js** and designed around **Discord Components V2**.

[Features](#features) • [Setup](#setup) • [Configuration](#configuration) • [Project Structure](#project-structure)

</div>

## Features

- 📩 DM-based Modmail
- 🧵 Persistent ticket/thread handling
- Components V2 staff interface
- Reply, claim, close, and reopen controls
- Application-owned Discord emoji support
- Centralized logging with `logger.js`
- SQLite persistence
- Permission and interaction validation
- Transcript support
- Environment-based configuration

## Setup

### Requirements

- Node.js 20 or newer
- A Discord application and bot
- Required Discord bot permissions and intents

### Installation

```bash
git clone https://github.com/Ddeveloper-sr/Modmail-Bot.git
cd Modmail-Bot
npm install
```

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in the required values, then start the bot:

```bash
npm start
```

## Configuration

Create a `.env` file locally. Never commit it to GitHub.

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
MODMAIL_CATEGORY_ID=
LOG_CHANNEL_ID=
```

## Application-Owned Emojis

Emoji source files belong in:

```text
assets/emojis/
```

The intended workflow is:

1. Create the emoji assets locally.
2. Upload/register them through **Discord Developer Portal → Your Application → Emoji**.
3. Store the resulting emoji IDs in the local environment/configuration.
4. Let the bot reference its application-owned emojis instead of depending on emojis hosted by another server.

The repository contains the source assets only; application emoji IDs and secrets should remain configuration values.

## Project Structure

```text
src/
├── commands/
├── events/
├── handlers/
├── components/
├── utils/
│   ├── emojiManager.js
│   └── logger.js
├── database/
└── index.js

assets/
└── emojis/

config/
└── config.js

.env.example
.gitignore
package.json
README.md
```

## Security

Do **not** commit:

- Discord bot tokens
- `.env` files
- Database files containing private data
- Private transcripts
- Other credentials or secrets

Use `.env.example` for non-secret configuration documentation.

## License

This project is currently provided without a license. Add a license before distributing or publishing the source for reuse.
