module.exports = async (bot: any, interaction: any) => {
  await interaction.createMessage({
    content: `:x: Embed could not be sent`,
    flags: 1 << 6,
  })
}