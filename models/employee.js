const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
    codigo: { type: String },
    cliente: { type: String },
    fecha: { type: String },
    perfil: { type: Number },
    contador: { type: Number }
});

module.exports = mongoose.model('Employee', employeeSchema);