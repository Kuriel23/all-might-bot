const discord = require("discord.js");

module.exports = {
	data: new discord.SlashCommandBuilder()
		.setName("parcerias")
		.setDescription("Veja todas as parcerias de um usuário!")
		.addUserOption((option) =>
			option
				.setName("usuário")
				.setDescription(
					"Identifique o usuário para calcular parcerias."
				)
				.setRequired(true)
		),
	async execute(interaction, client) {
		const user = interaction.options.getUser("usuário");

		const doc = await client.db.Staffs.findOne({ _id: user.id });
		interaction.reply({
			content: `${user.toString()} têm atualmente ${
				doc ? doc.partner : 0
			} parcerias.`,
		});
	},
};
