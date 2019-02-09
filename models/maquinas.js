const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var date = require('date-and-time');
let now = new Date();
const maquinas2Schema = new Schema({
    iplocal: { type: String },
    ippublico: { type: String },
    uptime: { type: String },
    mac: { type: String, unique: true },
    img: { type: String, required: false },
    sucursals: {
        type: Schema.Types.String,
        ref: 'Sucursal',
        required: [true, 'El id hospital esun campo obligatorio ']
    },
    updatedAt: { type: String, default: date.format(now, 'YYYY-MM-DD HH:mm:ss') }
    //   ultimo: {type: Date, default: Date.()}


});

//maquinas2Schema.pre("save", function preSave(next) {
//    const currentDate = new Date()
//    this.updatedAt = currentDate.now
//    next()
//  });

module.exports = mongoose.model('Maquinas', maquinas2Schema);