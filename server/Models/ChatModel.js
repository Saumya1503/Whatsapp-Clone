const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({

    sent_by: {
        type: String,
        required: true
    },
    sent_to: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    is_new: {
        type: Boolean,
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '100000m' },
    },

})

module.exports = mongoose.model("Chats", chatSchema);