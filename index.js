require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  if (guild) {
    console.log(`Monitoring server: ${guild.name}`);
  } else {
    console.warn('Server not found. Check DISCORD_GUILD_ID in your .env file.');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);

app.get('/health', (req, res) => {
  res.json({
    status: 'UP'
  });
});


app.post('/api/alexa', async (req, res) => {
  try {
    console.log('Incoming Alexa request:');
    console.log(JSON.stringify(req.body, null, 2));

    const { request } = req.body;

    if (request?.type === 'LaunchRequest') {
      console.log('LaunchRequest received');
      return res.json({
        version: '1.0',
        response: {
          outputSpeech: {
            type: 'SSML',
            ssml: '<speak>Olá! Você pode perguntar quem está na call do Discord.</speak>'
          },
          shouldEndSession: false
        }
      });
    }

    if (request?.type === 'IntentRequest') {
      const intentName = request.intent?.name;
      console.log(`Intent received: ${intentName}`);

      if (intentName === 'DiscordUsersIntent') {
        const users = await getDiscordUsers();

        return res.json({
          version: '1.0',
          response: {
            outputSpeech: {
              type: 'SSML',
              ssml: `<speak>${users}</speak>`
            },
            shouldEndSession: true
          }
        });
      } else {
        console.warn(`Unhandled intent: ${intentName}`);
      }
    } else {
      console.warn(`Unhandled request type: ${request?.type}`);
    }

    return res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: '<speak>Desculpe, não consegui entender o pedido.</speak>'
        },
        shouldEndSession: true
      }
    });
  } catch (error) {
    console.error('Error handling Alexa request:', error);
    return res.json({
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: '<speak>Ocorreu um erro ao processar sua solicitação.</speak>'
        },
        shouldEndSession: true
      }
    });
  }
});

async function getDiscordUsers() {
  const usersByChannel = [];

  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  if (!guild) {
    console.warn('Guild not found with the provided ID.');
    return 'Não consegui acessar o servidor especificado.';
  }

  const voiceChannels = guild.channels.cache.filter(c => c.type === 2);

  voiceChannels.forEach(channel => {
    const members = channel.members.map(member => member.user.username);
    console.log(`Channel ${channel.name} has ${members.length} user(s).`);

    if (members.length > 0) {
      usersByChannel.push({
        channelName: channel.name,
        users: members
      });
    }
  });

  if (usersByChannel.length === 0) {
    return 'Não há usuários em nenhum canal de voz no momento.';
  }

  let response = '';
  usersByChannel.forEach(channel => {
    const usersList = channel.users.join(', ');
    response += `No canal ${channel.channelName} temos: ${usersList}. `;
  });

  return response;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});