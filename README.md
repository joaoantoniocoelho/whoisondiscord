# Discord Users Bot with Alexa Integration

A Discord bot that integrates with Amazon Alexa to provide information about users in Discord voice channels in Brazilian Portuguese (pt-BR).

## Features

- Discord bot that monitors voice channels
- REST API endpoint for Alexa integration
- Alexa skill that reads out users in each voice channel in Brazilian Portuguese

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Discord Bot Token
- Amazon Developer Account (for Alexa skill)

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following content:
   ```
   DISCORD_BOT_TOKEN=your_discord_bot_token_here
   PORT=3000
   ```

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the "Bot" tab and create a bot
4. Copy the bot token and add it to your `.env` file
5. Enable these Privileged Gateway Intents:
   - GUILD_MEMBERS
   - GUILD_VOICE_STATES
6. Use the OAuth2 URL Generator to invite your bot to your server with the following scopes:
   - bot
   - applications.commands
   
### Alexa Skill Setup

1. Go to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Create a new skill:
   - Name: "Discord Users"
   - Primary locale: Portuguese (BR)
   - Skill model: Custom
   - Hosting method: Provision your own
3. Copy the contents of `alexa-skill-model.json` to the JSON Editor in the Interaction Model section
4. Set up an HTTPS endpoint for your API (using ngrok or deploying to a service like Heroku, AWS, etc.)
5. In the Endpoint section, enter your HTTPS API URL followed by `/api/alexa`
6. Build and test your skill

## Running the Bot

```
node index.js
```

## Usage

1. Start the Discord bot
2. Ensure your Alexa skill is enabled in your Amazon account
3. Say "Alexa, abrir discord bot"
4. Then ask "quem está no discord" or any other phrase defined in the interaction model

## License

ISC 