# Who's On Discord - Alexa + Discord Integration

This project allows Amazon Alexa to tell you which users are currently connected to a specific voice server on Discord.

## 🔧 Features

- Integrates a Discord bot with an Alexa custom skill
- Responds in Brazilian Portuguese via Alexa
- Reports voice channel activity from a specific server
- Can be tested with a real Alexa device or the Alexa Developer Console

## 🚀 How It Works

1. A Discord bot connects to your server and monitors all voice channels.
2. An Alexa Skill sends a request to your backend (`/api/alexa`) using HTTPS.
3. Alexa receives a spoken response based on current channel voice activity.

## 🧪 Requirements

- Node.js 18+
- A Discord bot token
- A Discord server (GUILD_ID)
- An Alexa developer account
- A public HTTPS endpoint (e.g., Render, Vercel)

## ⚙️ Environment Variables

Create a `.env` file with:

```env
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_guild_id
PORT=3000
