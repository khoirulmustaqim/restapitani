const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    id_artikel: String,
    nama: String,
    tanggal: String,
    uid : String,
})

module.exports = mongoose.model('Like', LikeSchema);
