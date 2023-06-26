const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    isAdmin: {
        type: Boolean,
    }
});

UserSchema.plugin(passportLocalMongoose); //it adds username password field

module.exports = mongoose.model('User', UserSchema)