const express = require('express');
const api = express.Router();

//import models
const Artikel = require('../models/Artikels')
const Like = require('../models/Like');
const Komentar = require('../models/Komentar')
api.patch('/:id_artikel', async (req, res, next) => {
    const id = req.params.id_artikel;
    const { nama, uid } = req.body;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let add = new Like({
        id_artikel: id,
        nama: nama,
        tanggal: date,
        uid: uid
    })
    try {
        await Artikel.findById(id).then(data=>{
            let like = data.like;
            data.like = like + 1;
            data.save().then(snap=>{
                add.save().then(result=>{
                    res.send({
                        like : snap.like,
                        nama : result.nama
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
        await Like.find().then(snap => {
            res.send(snap);
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Like.find({id_artikel : id}).then(result => {
            res.send(result);
        })
    } catch (error) {
        res.send(error)
    }
})

api.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Like.findById(id).then(obj => {
            obj.remove().then(() => {
                res.send({ pesan: 'Berhasil di hapus' });
            })
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/point/:id', async(req, res, next)=>{
    const id = req.params.id;
    try {
        await Like.find({uid : id}).then(result1=>{
             Komentar.find({uid : id}).then(result2=>{
                res.send({jml : result1.length + result2.length})
            })
        })
    } catch (error) {
        res.send(error)
    }
})
module.exports = api;