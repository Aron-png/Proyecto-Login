const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    id: { type: Object },
    idUser: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now } // Agregar campo createdAt de tipo Date
});

module.exports = mongoose.model("Todo", TodoSchema);
