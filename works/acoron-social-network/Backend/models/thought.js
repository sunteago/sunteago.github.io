const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thoughtSchema = new Schema({
    author: String,
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    account: String,
    content: String,
    likes: {
        type: Number,
        default: 0
    },
    whoLiked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        accountId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String, date: Date,
        likes: {
            type: Number,
            default: 0
        },
        whoLiked: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        createdAt: Date
    }],
    avatar: String,
    createdAt: Date
});

module.exports = mongoose.model('Thought', thoughtSchema);