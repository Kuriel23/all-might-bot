const discord = require("discord.js");

module.exports = async (client, message) => {
	if (message.guild === null) return;

	if (message.author.bot) return;

	const doc = await client.db.Users.findOne({ _id: message.author.id });

	if (doc) {
		doc.messages += 1;
		doc.save();
	} else {
		new client.db.Users({ _id: message.author.id, messages: 1 }).save();
	}

	if (message.channel.id === "1107297728146452560") {
		message.reply({ content: "<@&1107366644952617151>" });
	}

	if (message.channel.id === "1107336941038485656") {
		const doc = await client.db.Staffs.findOne({ _id: message.author.id });
		if (doc) {
			doc.partner += 1;
			doc.save();
		} else {
			new client.db.Staffs({
				_id: message.author.id,
				partner: 1,
			}).save();
		}
	}

	if (
		message.content.startsWith("am?") &&
		message.author.id === "354233941550694400"
	) {
		message.delete();
		require("../messages/" + message.content.replace("am?", ""))(
			client,
			message
		);
	}

	if (message.guild.id === process.env.GUILD_ID) {
		if (!message.member.permissions.has("Administrator")) return;
		if (message.content.startsWith(`<@${client.user.id}>`)) {
			const embed = new discord.EmbedBuilder()
				.setTitle("Control - A fast and efficient control")
				.setDescription(
					"Comandos de desenvolvimento tudo num menu de controlo rápido e eficiente!"
				)
				.setColor(client.cor);
			const row = new discord.ActionRowBuilder().addComponents(
				new discord.StringSelectMenuBuilder()
					.setCustomId("control")
					.setPlaceholder("Controle tudo imediatamente!")
					.addOptions({
						label: "Faça evaluate de um código (dev only)",
						description: "Cuidado isto pode ser perigoso!",
						value: "eval",
					})
			);
			message.reply({ embeds: [embed], components: [row] });
		}
	}
};
