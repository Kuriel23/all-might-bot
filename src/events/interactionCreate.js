module.exports = (client, interaction) => {
	if (interaction.isStringSelectMenu()) {
		require("../menu/" + interaction.customId)(client, interaction);
	}
	if (interaction.isButton()) {
		require("../button/" + interaction.customId)(client, interaction);
	}
	if (interaction.isChatInputCommand()) {
		if (
			interaction.member.roles.highest.comparePositionTo(
				interaction.guild.members.fetch(client.user.id).roles.highest
			) > 0
		) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return;
			try {
				command.execute(interaction, client);
			} catch (err) {
				if (err) console.error(err);
				interaction.reply({
					content: "Um erro foi executado no meu grande algoritmo.",
					ephemeral: true,
				});
			}
		} else {
			interaction.reply({
				content:
					"Não se preocupe, jovem. Você não precisa de comandos para ser um verdadeiro herói.",
			});
		}
	}
};
