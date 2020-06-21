const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtikelSchema =  new Schema({
    judul : String,
    kategori: String,
    konten : String,
    uid : String,
    user_post : String,
    img : String,
    tanggal : String,
    like : Number,
    komentar : Number
});

module.exports = mongoose.model('Artikel', ArtikelSchema);
