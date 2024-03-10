const Mongoose = require("mongoose");
//Ésto es un esquema para los Token, como el usuario
const TokenSchema = new Mongoose.Schema({
    id: {type: Object},
    token: {type: String, require: true},
});
module.exports = Mongoose.model("Token",TokenSchema);