const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("vips")
    .setDescription("Coisas para vips!")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("register")
        .setNameLocalizations({
          "pt-BR": "registrar",
          "en-US": "register",
        })
        .setDescription("Registre alguém")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setNameLocalizations({
              "pt-BR": "usuário",
              "en-US": "user",
            })
            .setDescription("Identifique o utilizador")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("vip")
            .setDescription("Identifique o cargo de vip")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("tempo")
            .setNameLocalizations({
              "pt-BR": "tempo",
              "en-US": "time",
            })
            .setDescription("Identifique o tempo de vip")
            .setRequired(true)
            .addChoices(
              { name: "1 mês", value: "1" },
              { name: "3 meses", value: "3" },
              { name: "6 meses", value: "6" },
              { name: "1 ano", value: "12" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove_vip")
        .setNameLocalizations({
          "pt-BR": "remover_vip",
          "en-US": "remove_vip",
        })
        .setDescription("Remova o vip de alguém")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setNameLocalizations({
              "pt-BR": "usuário",
              "en-US": "user",
            })
            .setDescription("Identifique o utilizador")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Veja o registro de alguém")
        .addUserOption((option) =>
          option
            .setName("usuário")
            .setNameLocalizations({
              "pt-BR": "usuário",
              "en-US": "user",
            })
            .setDescription("Identifique o utilizador")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options._subcommand;
    const membro = interaction.options.getMember("usuário") || null;
    switch (subcommand) {
      case "register": {
        if (!interaction.member.permissions.has("ManageRoles"))
          return interaction.reply({
            content: "Sem permissão",
            ephemeral: true,
          });
        const cargo = interaction.options.getRole("vip");
        const person = interaction.guild.members.cache.get(membro.id);
        person.roles.add(cargo);
        person.roles.add("1107419608266326107");
        person.roles.add("1107419654806310982");
        const _date = new Date();
        _date.setMonth(
          _date.getMonth() + parseInt(interaction.options.getString("tempo"))
        );
        const date = new Date(_date);
        const guild = await client.db.Guilds.findOne({ _id: "1" });
        guild.vipschedule.push({
          _id: membro.id,
          vip: cargo.id,
          schedule: date,
        });
        guild.save();
        const doc = await client.db.Users.findOne({ _id: membro.id });
        if (!doc) {
          new client.db.Users({
            _id: membro.id,
          }).save();
        }
        interaction.reply({ content: "Operação bem sucedida!" });
        break;
      }
      case "remove_vip": {
        if (!interaction.member.permissions.has("ManageRoles"))
          return interaction.reply({
            content: "Você não está permitido a retirar usuários como VIP's.",
            ephemeral: true,
          });

        const doc = await client.db.Guilds.findOne(
          { vipschedule: { $elemMatch: { _id: membro.id } } },
          { userId: 1, "vipschedule.$": 1 }
        );
        const cargo = interaction.guild.roles.cache.find(
          (r) => r.id === doc.vipschedule[0].vip
        );

        const person = interaction.guild.members.cache.get(membro.id);

        interaction.reply({ content: "Retirado com sucesso." });

        person.roles.remove(cargo);
        doc.vipschedule.pull({ _id: membro.id });
        doc.save();
        break;
      }
      case "info": {
        if (!interaction.member.permissions.has("ManageRoles"))
          return interaction.reply({
            content: "Sem permissão",
            ephemeral: true,
          });
        const guild = await client.db.Guilds.findOne({ _id: "1" });
        const vip = guild.vipschedule.id(membro.id);
        if (!vip)
          return interaction.reply({
            content: "Sem VIP detectado.",
            ephemeral: true,
          });
        const emb = new discord.EmbedBuilder()
          .setTitle("Vip de " + membro.user.tag)
          .setColor(client.cor)
          .addFields(
            { name: "VIP", value: `<@&${vip.vip}>` },
            {
              name: "Data de término",
              value: discord.time(vip.schedule, "f"),
            }
          );
        interaction.reply({ embeds: [emb] });
        break;
      }
    }
  },
};
