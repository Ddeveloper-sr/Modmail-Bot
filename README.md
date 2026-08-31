<div align="center">

# Modmail Bot

A modern Discord Modmail bot built with **discord.js** and **Discord Components V2**.

DM the bot to open a support ticket. Staff manage tickets from a private Modmail channel.

[Features](#features) • [Setup](#setup) • [Configuration](#configuration) • [Emojis](#application-owned-emojis) • [Structure](#project-structure)

</div>

## Features

- DM-based Modmail
- One persistent ticket per user
- Private staff ticket channels
- Components V2 ticket controls
- Reply, claim, close, and reopen actions
- Application-owned emoji IDs
- Centralized `logger.js`
- SQLite persistence
- Permission checks
- Environment-based configuration

Components V2 is implemented with current `discord.js` builders such as `ContainerBuilder` and `TextDisplayBuilder`. citeturn1search1turn1search0

## Setup

### Requirements

- Node.js 20+
- A Discord application with a bot user
- A server where the bot can create/manage Modmail channels

### Installation

```bash
git clone https://github.com/Ddeveloper-sr/Modmail-Bot.git
cd Modmail-Bot
npm install
cp .env.example .env
npm start
```

## Configuration

Create `.env` locally and never commit it.

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
MODMAIL_CATEGORY_ID=
LOG_CHANNEL_ID=
STAFF_ROLE_ID=
DATABASE_PATH=./data/modmail.db
EMOJI_MODMAIL_ID=
EMOJI_REPLY_ID=
EMOJI_CLAIM_ID=
EMOJI_CLOSE_ID=
EMOJI_REOPEN_ID=
```

The bot needs the message-related intents required for its Modmail workflow. Keep the bot token private.

## Application-Owned Emojis

Emoji source assets are stored in:

```text
assets/emojis/
├── modmail.png
├── reply.png
├── claim.png
├── close.png
└── reopen.png
```

The important distinction is that the PNGs are repository assets, while the **application emoji IDs** are the values used by the bot at runtime. The IDs should be placed in `.env` after the emojis have been registered to the Discord application.

Discord's public custom-emoji documentation describes server-uploaded custom emojis as server-specific; this project therefore keeps emoji handling isolated behind `emojiManager.js` and uses application emoji IDs rather than relying on another server's emoji collection. citeturn0search2turn0search3

## Project Structure

```text
src/
├── database.js
├── config.js
├── index.js
├── modmail.js
├── ui.js
└── utils/
    ├── emojiManager.js
    └── logger.js

assets/
└── emojis/
    ├── modmail.png
    ├── reply.png
    ├── claim.png
    ├── close.png
    └── reopen.png

.env.example
.gitignore
package.json
README.md
```

## Modmail Flow

```text
User DM
   │
   ▼
Bot receives message
   │
   ├── Find existing ticket
   │
   └── Create private staff channel if needed
   │
   ▼
Staff Modmail channel
   │
   ├── Reply
   ├── Claim
   ├── Close
   └── Reopen
   │
   ▼
User receives staff reply by DM
```

## Security

Never commit:

- Bot tokens
- `.env`
- SQLite database files
- Private transcripts
- Credentials

## License

No license has been selected yet. Add one before distributing the source under specific reuse terms.
