const mongoose = require('mongoose');
const { Schema } = mongoose;

const cardSchema = new Schema({
    description: { type: String },
    header: { type: String },
    summary: { type: String },
    radio: { type: Schema.Types.ObjectId, ref: 'radio' }
});

module.exports = mongoose.model('Card', cardSchema);