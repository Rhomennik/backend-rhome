const mongoose = require('mongoose');
const { Schema } = mongoose;

const radioSchema = new Schema({
    name: { type: String },
    position: { type: String },
    card: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }]
});

module.exports = mongoose.model('Radio', radioSchema);