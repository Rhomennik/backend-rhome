var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var departamentosSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'], unique: true },
    numero: { type: Number },
    sucursal: { type: Schema.Types.ObjectId, ref: 'Sucursal' }
});

module.exports = mongoose.model('Departamentos', departamentosSchema);