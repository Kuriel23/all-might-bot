const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require("fs");
require("dotenv").config();
const { ChalkAdvanced } = require("chalk-advanced");
const schedule = require("node-schedule");
const discord = require("discord.js");

module.exports = async (client) => {
	const commandFiles = readdirSync("./src/commands/").filter((file) =>
		file.endsWith(".js")
	);

	const commands = [];

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}

	const rest = new REST({
		version: "10",
	}).setToken(process.env.TOKEN);

	(async () => {
		try {
			if (process.env.STATUS === "PRODUCTION") {
				// If the bot is in production mode it will load slash commands for all guilds
				await rest.put(Routes.applicationCommands(client.user.id), {
					body: commands,
				});
				console.log(
					`${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
						"Sucesso registrado comandos globalmente"
					)}`
				);
			} else {
				await rest.put(
					Routes.applicationGuildCommands(
						client.user.id,
						process.env.GUILD_ID
					),
					{
						body: commands,
					}
				);

				console.log(
					`${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
						"Sucesso registrado comandos localmente"
					)}`
				);
			}
		} catch (err) {
			if (err) console.error(err);
		}
	})();
	client.user.setPresence({
		activities: [{ name: `I AM HERE!`, type: 0 }],
		status: "dnd",
	});

	schedulers();

	schedule.scheduleJob("0 0 * * *", async function () {
		const docPartner = await client.db.Staffs.find({});
		const docMessages = await client.db.Users.find({});
		client.channels.cache.get("1109869305799131196").send({
			embeds: [
				discord
					.EmbedBuilder()
					.setTitle("Resultado das Parcerias de hoje:")
					.setColor(client.cor)
					.setDescription(
						docPartner
							.map((doc) => {
								return `<@${doc._id}> • ${doc._id} • ${doc.messages}`;
							})
							.join("\n")
					),
			],
		});
		client.channels.cache.get("1109869305799131196").send({
			embeds: [
				discord
					.EmbedBuilder()
					.setTitle("Resultado das Mensagens de hoje:")
					.setColor(client.cor)
					.setDescription(
						docMessages
							.filter((doc) => doc.messages > 0)
							.map((doc) => {
								return `<@${doc._id}> • ${doc._id} • ${doc.messages}`;
							})
							.join("\n")
					),
			],
		});
		await client.db.Staffs.updateMany({}, { partner: 0 });
		await client.db.Users.updateMany({}, { messages: 0 });
	});

	async function schedulers() {
		const not = await client.db.Guilds.findOne({ _id: "1" });
		if (not) {
			not.vipschedule.forEach((vips) => {
				schedule.scheduleJob(vips.schedule, async function () {
					const cargo = vips.vip;

					const person = client.guilds.cache
						.get("1107290930148548628")
						.members.cache.get(vips._id);
					if (person) person.roles.remove(cargo);
					not.vipschedule.pull({ _id: vips._id });
					await client.db.Guilds.findOneAndUpdate(
						{ _id: "1" },
						{ $pull: { vipschedule: { _id: vips._id } } },
						{ new: true }
					);
				});
			});
		}
	}
};
