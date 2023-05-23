const { connect, Schema, model } = require("mongoose");
const { ChalkAdvanced } = require("chalk-advanced");
connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log(
      `${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
        "✅ • Carregado com sucesso [BANCO DE DADOS]"
      )}`
    )
  )
  .catch(() =>
    console.log(
      `${ChalkAdvanced.gray(">")} ${ChalkAdvanced.red(
        "❎ • Conexão do banco de dados falhada"
      )}`
    )
  );

const usersSchema = new Schema({
  _id: { type: String, required: true },
  messages: Number,
});

const staffsSchema = new Schema({
  _id: { type: String, required: true },
  partner: Number,
});

const guildSchema = new Schema({
  _id: { type: String, required: true },
  vipschedule: [
    {
      _id: String,
      vip: String,
      schedule: Date,
    },
  ],
});

module.exports.Users = model("Users", usersSchema);
module.exports.Staffs = model("Staffs", staffsSchema);
module.exports.Guilds = model("Guilds", guildSchema);
