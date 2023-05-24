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

		const membrosComCargo = cargo.members.filter((m) => !m.user.bot);
		const docFinal = await client.db.Users.find({})
			.filter((doc) => doc.messages >= 0)
			.filter((doc) =>
				membrosComCargo.some((membro) => membro.id === doc._id)
			);
		interaction.reply({
			embeds: [
				new discord
					.EmbedBuilder()
					.setTitle("Resultado das Mensagens do cargo escolhido:")
					.setColor(client.cor)
					.setDescription(
						docFinal
							.filter((doc) => doc.messages > 0)
							.map((doc) => {
								return `<@${doc._id}> • ${doc._id} • ${doc.messages}`;
							})
							.join("\n")
					),
			],
		});
	},
};
