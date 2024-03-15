const mongoose = require("mongoose");
//Ésto es un esquema para los Token, como el usuario
const TokenSchema = new mongoose.Schema({
    id: {type: Object},
    token: {type: String, require: true},
});
module.exports = mongoose.model("Token",TokenSchema);