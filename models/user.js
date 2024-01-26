const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true,
    }
})

// Using plugin the username and password is automatically provided by local mongoose.
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);