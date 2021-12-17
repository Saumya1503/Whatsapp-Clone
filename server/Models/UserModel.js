const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    full_name: {
        type: String,
        required: true
    },
    user_friends: {
        type: [],
        default: []
    },
    user_blocked: {
        type: [],
        default: []
    },
}, {timestamps:true})

module.exports = mongoose.model("Users", userSchema);