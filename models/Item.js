const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    mediaUrl: String,
    type: {
        type: String,
        enum: ['item', 'post'],
        default: 'item'
    }
});

module.exports = mongoose.model('Item', ItemSchema);
