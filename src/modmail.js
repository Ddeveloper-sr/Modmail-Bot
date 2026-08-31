const {
  ChannelType,
  PermissionFlagsBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags
} = require('discord.js');
const { ticketPanel } = require('./ui');
const logger = require('./utils/logger');

class Modmail {
  constructor(client, config, db) {
    this.client = client;
    this.config = config;
    this.db = db;
  }

  async getOrCreateTicket(user) {
    const existing = this.db.getByUser.get(user.id);
    if (existing) {
      const channel = await this.client.channels.fetch(existing.channel_id).catch(() => null);
      if (channel) return { record: existing, channel };
      this.db.remove.run(user.id);
    }

    const guild = await this.client.guilds.fetch(this.config.guildId);
    const channel = await guild.channels.create({
      name: `modmail-${user.username.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20) || user.id}`,
      type: ChannelType.GuildText,
      parent: this.config.modmailCategoryId,
      topic: `Modmail for ${user.tag} (${user.id})`,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: this.config.staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
        { id: this.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] }
      ]
    });

    this.db.create.run(user.id, channel.id, Date.now());
    logger.info('Modmail ticket created', { userId: user.id, channelId: channel.id });
    await channel.send({ flags: MessageFlags.IsComponentsV2, components: [ticketPanel(user, 'open', null)] });
    return { record: this.db.getByUser.get(user.id), channel };
  }

  async handleUserMessage(message) {
    if (message.author.bot || message.guild) return;
    const { channel } = await this.getOrCreateTicket(message.author);
    const files = [...message.attachments.values()].map(a => a.url);
    await channel.send({
      content: `**${message.author.tag}:** ${message.content || '(attachment)'}`,
      files
    });
  }

  async handleStaffMessage(message) {
    if (!message.guild || message.author.bot) return;
    if (!message.member.roles.cache.has(this.config.staffRoleId)) return;
    const record = this.db.getByChannel.get(message.channel.id);
    if (!record || !message.content || message.content.startsWith('!')) return;
    const user = await this.client.users.fetch(record.user_id).catch(() => null);
    if (!user) return;
    await user.send(message.content).catch(() => null);
  }

  async handleInteraction(interaction) {
    if (!interaction.isButton()) return false;
    if (!interaction.customId.startsWith('modmail:')) return false;
    const record = this.db.getByChannel.get(interaction.channelId);
    if (!record) return true;
    if (!interaction.member.roles.cache.has(this.config.staffRoleId)) {
      await interaction.reply({ content: 'You do not have permission to manage Modmail tickets.', flags: MessageFlags.Ephemeral });
      return true;
    }

    if (interaction.customId === 'modmail:claim') {
      this.db.claim.run(interaction.user.id, record.user_id);
      await interaction.reply({ content: `Claimed by ${interaction.user}.`, flags: MessageFlags.Ephemeral });
      await interaction.channel.send({ flags: MessageFlags.IsComponentsV2, components: [ticketPanel(`<@${record.user_id}>`, 'open', interaction.user.id)] });
    }

    if (interaction.customId === 'modmail:close') {
      this.db.close.run(Date.now(), record.user_id);
      await interaction.reply({ content: 'Ticket closed.', flags: MessageFlags.Ephemeral });
      const user = await this.client.users.fetch(record.user_id).catch(() => null);
      if (user) await user.send('Your Modmail ticket has been closed. You can DM me again to reopen a new ticket.').catch(() => null);
      await interaction.channel.send({ flags: MessageFlags.IsComponentsV2, components: [ticketPanel(`<@${record.user_id}>`, 'closed', record.claimed_by)] });
    }

    if (interaction.customId === 'modmail:reopen') {
      this.db.reopen.run(record.user_id);
      await interaction.reply({ content: 'Ticket reopened.', flags: MessageFlags.Ephemeral });
      await interaction.channel.send({ flags: MessageFlags.IsComponentsV2, components: [ticketPanel(`<@${record.user_id}>`, 'open', record.claimed_by)] });
    }

    if (interaction.customId === 'modmail:reply') {
      const modal = new ModalBuilder().setCustomId(`modmail:reply:${record.user_id}`).setTitle('Reply to user');
      const input = new TextInputBuilder().setCustomId('message').setLabel('Message').setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(4000);
      modal.addComponents(new ActionRowBuilder().addComponents(input));
      await interaction.showModal(modal);
    }
    return true;
  }

  async handleModal(interaction) {
    if (!interaction.isModalSubmit() || !interaction.customId.startsWith('modmail:reply:')) return false;
    if (!interaction.member.roles.cache.has(this.config.staffRoleId)) return true;
    const userId = interaction.customId.split(':')[2];
    const user = await this.client.users.fetch(userId).catch(() => null);
    if (!user) return interaction.reply({ content: 'User could not be found.', flags: MessageFlags.Ephemeral });
    const content = interaction.fields.getTextInputValue('message');
    await user.send(content);
    await interaction.reply({ content: 'Reply sent.', flags: MessageFlags.Ephemeral });
    await interaction.channel.send(`**${interaction.user.tag}:** ${content}`);
    return true;
  }
}

module.exports = { Modmail };
