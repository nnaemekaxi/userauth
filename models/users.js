const {Schema, model} = require("mongoose");

const UsersSchema = new Schema ({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true},
   password: { type: String, required: true},
},
{ collection: "users"}
);

module.exports = model("UsersShema", UsersSchema);