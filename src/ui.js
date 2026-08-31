const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  TextDisplayBuilder
} = require('discord.js');
const { applicationEmoji } = require('./utils/emojiManager');

function button(label, style, customId, emojiName) {
  const builder = new ButtonBuilder().setLabel(label).setStyle(style).setCustomId(customId);
  const emoji = emojiName && applicationEmoji(emojiName);
  if (emoji) builder.setEmoji(emoji);
  return builder;
}

function ticketPanel(user, status, claimedBy) {
  const claimText = claimedBy ? `Claimed by <@${claimedBy}>` : 'Unclaimed';
  const container = new ContainerBuilder()
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('## Modmail'))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**User:** ${user}\n**Status:** ${status}\n**${claimText}**`))
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        button('Reply', ButtonStyle.Primary, 'modmail:reply', 'reply'),
        button('Claim', ButtonStyle.Secondary, 'modmail:claim', 'claim'),
        button('Close', ButtonStyle.Danger, 'modmail:close', 'close')
      )
    );

  if (status === 'closed') {
    container.addActionRowComponents(
      new ActionRowBuilder().addComponents(
        button('Reopen', ButtonStyle.Success, 'modmail:reopen', 'reopen')
      )
    );
  }

  return container;
}

module.exports = { ticketPanel };
