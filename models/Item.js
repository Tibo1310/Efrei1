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
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', ItemSchema);
