const express = require('express');
const api = express.Router();

//import models
const Artikel = require('../models/Artikels')
const Komentar = require('../models/Komentar');

api.patch('/:id_artikel', async (req, res, next) => {
    const id = req.params.id_artikel;
    const { nama, uid, komentar } = req.body;
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let add = new Komentar({
        id_artikel: id,
        nama: nama,
        komentar: komentar,
        tanggal: date,
        uid: uid
    })
    try {
        await Artikel.findById(id).then(data => {
            let komentar = data.komentar;
            data.komentar = komentar + 1;
            data.save().then(snap => {
                add.save().then(result => {
                    res.send({
                        komentar: snap.komentar,
                        nama: result.nama
                    })
                })
            })
        })
    } catch (error) {
        res.send(error)
    }
})

api.get('/', async (req, res, next) => {
    try {
        await Komentar.find().then(snap => {
            res.send(snap);
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Komentar.find({id_artikel : id}).then(result => {
            res.send(result);
        })
    } catch (error) {
        res.send(error)
    }
})

api.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Komentar.findById(id).then(obj => {
            obj.remove().then(() => {
                res.send({ pesan: 'Berhasil di hapus' });
            })
        })
    } catch (error) {
        res.send(error)
    }
})

module.exports = api;