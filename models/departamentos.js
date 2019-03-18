var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var departamentosSchema = new Schema({
    nombre: { type: String, unique: true },
    numero: { type: Number },
    player: { type: Schema.Types.ObjectId, ref: 'Player' }
});

module.exports = mongoose.model('Departamentos', departamentosSchema);