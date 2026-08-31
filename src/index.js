require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  MessageFlags
} = require('discord.js');
const config = require('./config');
const logger = require('./utils/logger');
const { createDatabase } = require('./database');
const { Modmail } = require('./modmail');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const db = createDatabase(config.databasePath);
const modmail = new Modmail(client, config, db);

const commands = [
  new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Show the Modmail system status.')
    .setDMPermission(false)
].map(command => command.toJSON());

client.once('ready', async () => {
  logger.info('Bot ready', { tag: client.user.tag });
  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
  logger.info('Guild commands registered', { guildId: config.guildId });
});

client.on('messageCreate', async message => {
  try {
    if (message.guild) {
      await modmail.handleStaffMessage(message);
    } else {
      await modmail.handleUserMessage(message);
    }
  } catch (error) {
    logger.error('messageCreate failed', { error: error.message });
  }
});

client.on('interactionCreate', async interaction => {
  try {
    if (interaction.isChatInputCommand() && interaction.commandName === 'modmail') {
      await interaction.reply({ content: 'Modmail is active. Send the bot a DM to open a ticket.', flags: MessageFlags.Ephemeral });
      return;
    }

    if (interaction.isButton()) {
      await modmail.handleInteraction(interaction);
      return;
    }

    if (interaction.isModalSubmit()) {
      await modmail.handleModal(interaction);
    }
  } catch (error) {
    logger.error('interactionCreate failed', { error: error.message });
    const payload = { content: 'An unexpected error occurred.', flags: MessageFlags.Ephemeral };
    if (interaction.replied || interaction.deferred) await interaction.followUp(payload).catch(() => null);
    else await interaction.reply(payload).catch(() => null);
  }
});

process.on('unhandledRejection', error => logger.error('Unhandled rejection', { error: String(error) }));
process.on('uncaughtException', error => logger.error('Uncaught exception', { error: error.message }));

client.login(config.token);
