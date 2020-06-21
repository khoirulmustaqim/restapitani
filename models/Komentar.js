const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KomentarSchema = new Schema({
    id_artikel: String,
    nama: String,
    komentar: String,
    tanggal: String,
    uid : String
})

module.exports = mongoose.model('Komentar', KomentarSchema);

