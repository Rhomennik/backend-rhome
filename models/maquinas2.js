const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maquinas2Schema = new Schema({
    iplocal: { type: String},
    ippublico: { type: String},
    uptime: { type: String},
    mac: { type: String, unique: true },
    img: { type: String, required: false, default:'' },
    updatedAt: {type: Date, default: Date.now},


});

//maquinas2Schema.pre("save", function preSave(next) {
//    const currentDate = new Date()
//    this.updatedAt = currentDate.now
//    next()
//  });

module.exports = mongoose.model('Maquinas', maquinas2Schema);