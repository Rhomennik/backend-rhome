const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const maquinasSchema = new Schema({
    iplocal: { type: String},
    ippublico: { type: String},
    uptime: { type: String},
    mac: { type: String, unique: true},
    img: { type: String, required: false, default:'' },
    updatedAt: {type: Date, default: Date.time}


});
module.exports = mongoose.model('Maquinas', maquinasSchema);