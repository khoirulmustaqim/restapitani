const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema =  new Schema({
    username: String,
    nama: String,
    kota: String,
    nohp: String,
    email: String,
    password: String,
    role : String,
    img_user : String
})

module.exports = mongoose.model('User', UserSchema);