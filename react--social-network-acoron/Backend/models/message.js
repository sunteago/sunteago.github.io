const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Message', messageSchema);