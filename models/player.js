// Default
const mongoose = require('mongoose');
const { Schema } = mongoose;



// Schema
const playerSchema = new Schema({
    nombre: { type: String, unique: true, required: true },
    url: { type: String },
    detalles: { type: String }
});

module.exports = mongoose.model('Player', playerSchema);