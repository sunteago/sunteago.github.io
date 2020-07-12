const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    name: String, 
    author: String,
    email: String,
    password: String,
    avatar:  {
        type: 'String',
        default: ''
    },
    account: String,
    settings: {
        theme: {
            type: String,
            default: 'classic'
        },
        privacity: {
            type: String,
            default: 'all'
        },
        status: {
            type: String,
            default: "Hi, I'm excited to work with you!"
        }
    }
});

module.exports = mongoose.model('User', userSchema);