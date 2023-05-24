const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("msg")
    .setDescription("Veja todas as mensagens de um cargo escolhido!")
    .addRoleOption((option) =>
      option
        .setName("cargo")
        .setDescription("Identifique o cargo para calcular mensagens.")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const cargo = interaction.options.getRole("cargo");
    const membrosComCargo = await cargo.members.filter((m) => !m.user.bot);
    console.log(membrosComCargo);

    const descriptions = await Promise.all(
      membrosComCargo.map(async (membro) => {
        const doc = await client.db.Users.findOne({ _id: membro.id });
        if (!doc || doc.messages <= 0) return 0;
        return `${membro.toString()} • ${membro.id} • ${doc.messages}`;
      })
    );

    interaction.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setTitle("Resultado das Mensagens do cargo escolhido:")
          .setColor(client.cor)
          .setDescription(descriptions.join("\n")),
      ],
    });
  },
};
