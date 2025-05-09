require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(express.json());

// Inicializa o bot do Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Evento de pronto do bot
client.once('ready', () => {
  console.log(`✅ Bot logado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  if (guild) {
    console.log(`🎯 Monitorando servidor: ${guild.name}`);
  } else {
    console.warn('⚠️ Servidor não encontrado. Verifique o DISCORD_GUILD_ID no .env');
  }
});

// Login do bot
client.login(process.env.DISCORD_BOT_TOKEN);

// Endpoint da Alexa
app.post('/api/alexa', async (req, res) => {
  try {
    const { request } = req.body;

    if (request.type === 'IntentRequest') {
      if (request.intent.name === 'DiscordUsersIntent') {
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
      }
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
    console.error('Erro ao lidar com a Alexa:', error);
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

// Função para obter usuários nos canais de voz do servidor especificado
async function getDiscordUsers() {
  const usersByChannel = [];

  const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
  if (!guild) {
    return 'Não consegui acessar o servidor especificado.';
  }

  const voiceChannels = guild.channels.cache.filter(c => c.type === 2); // 2 = Voice Channel

  voiceChannels.forEach(channel => {
    const members = channel.members.map(member => member.user.username);

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

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
