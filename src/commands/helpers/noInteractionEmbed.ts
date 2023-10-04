module.exports = async (bot: any, interaction: any) => {
  interaction.createMessage({
    content: `:x: Embed could not be sent`,
  })
}