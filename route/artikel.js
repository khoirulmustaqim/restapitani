const express = require('express');
const api = express.Router();
const multer = require('multer');

//import models
const Artikel = require('../models/Artikels');

const penyimpanan = multer.diskStorage({
    destination: './storage/artikel/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const filterImg = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: penyimpanan, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: filterImg
});

api.post('/', upload.single('img'), async (req, res, next) => {
    let avatar = 'none';
    const { judul, kategori, konten, uid, user_post } = req.body;
    if (req.file) {
        avatar = req.file.filename;
    }
    let add = new Artikel({
        judul: judul,
        kategori: kategori,
        konten: konten,
        uid: uid,
        user_post: user_post,
        img: avatar,
        tanggal: Date.now(),
        like: 0,
        komentar: 0
    })
    try {
        await add.save().then(post => {
            res.send(post._id);
        })
    } catch (error) {
        res.json(error)
    }
})
api.get('/', async (req, res, next) => {
    try {
        let data = [];
        await Artikel.find().then(snap => {
            snap.forEach(doc => {
                data.push({
                    _id: doc._id,
                    judul: doc.judul,
                    kategori: doc.kategori,
                    uid: doc.uid,
                    img: doc.img,
                    tanggal: Date(doc.tanggal).toString(),
                    like: doc.like,
                    komentar: doc.komentar,
                    user_post : doc.user_post
                })
            })
        }).then(result => {
            res.send(data);
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Artikel.findById(id).find().then(result => {
            res.send({
                _id: result[0]._id,
                judul: result[0].judul,
                kategori: result[0].kategori,
                uid: result[0].uid,
                konten: result[0].konten,
                img: result[0].img,
                tanggal: Date(result[0].tanggal).toString(),
                like: result[0].like,
                komentar: result[0].komentar,
                user_post : result[0].user_post,
                __v : result[0].__v
            });
        })
    } catch (error) {
        res.send(error)
    }
})
api.patch('/:id', upload.single('img'), async (req, res, next) => {
    const id = req.params.id;
    const { judul, kategori, konten, uid, img_none, user_post } = req.body;
    try {
        if (!req.file) {
            await Artikel.findById(id).then(obj => {
                obj.judul = judul;
                obj.kategori = kategori;
                obj.konten = konten;
                obj.uid = uid;
                obj.tanggal = Date.now();
                obj.img = img_none;
                obj.user_post = user_post;

                obj.save().then(result => {
                    res.send({ pesan: 'Berhasil Update', data: result })
                })
            })
        } else {
            await Artikel.findById(id).then(obj => {
                obj.judul = judul;
                obj.kategori = kategori;
                obj.konten = konten;
                obj.uid = uid;
                obj.tanggal = Date.now();
                obj.img = req.file.filename;
                obj.user_post = user_post;

                obj.save().then(result => {
                    res.send({ pesan: 'Berhasil Update', data: result })
                })
            })
        }
    } catch (error) {
        res.json(error)
    }
})
api.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Artikel.findById(id).then(obj => {
            obj.remove().then(() => {
                res.send({ pesan: 'Berhasil di hapus' });
            })
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/carikategori/:ktg', async (req, res, next) => {
    const kategori = req.params.ktg;
    try {
        await Artikel.find({ kategori: kategori }).then(result => {
            res.send(result)
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/carijudul/:judul', async (req, res, next) => {
    const judul = req.params.judul;
    try {
        await Artikel.findOne({ judul: judul }).then(result => {
            if (!result) {
                res.send({ pesan: 'Judul tidak ditemukan' })
            } else {
                res.send(result)
            }
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/myArtikel/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Artikel.find({ uid : id }).then(result => {
            if (!result) {
                res.send({ pesan: 'Belum ada postingan' })
            } else {
                res.send(result)
            }
        })
    } catch (error) {
        res.send(error)
    }
})
module.exports = api;