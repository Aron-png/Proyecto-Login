const mongoose = require('mongoose');
const TodoSchema = mongoose.Schema({
    id: { type: Object },
    idUser: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
});
module.exports = mongoose.model("Todo", TodoSchema);
