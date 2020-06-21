const express = require('express');
const api = express.Router();
const multer = require('multer');

//import models
const User = require('../models/User');

const penyimpanan = multer.diskStorage({
    destination: './storage/user/',
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

api.post('/', upload.single('img_user'), async (req, res, next) => {
    let avatar = 'none';
    const { username, nama, kota, nohp, email, password, role } = req.body;
    if (req.file) {
        avatar = req.file.filename;
    }
    let add = new User({
        username: username,
        nama: nama,
        kota: kota,
        nohp: nohp,
        email: email,
        password: password,
        role: role,
        img_user: avatar
    })
    try {
        await add.save().then(post => {
            res.send({
                uid: post._id,
                username: post.username,
                role: post.role,
                nama : post.nama
            })
        })
    } catch (error) {
        res.json(error)
    }
})
api.get('/', async (req, res, next) => {
    try {
        await User.find().then(snap => {
            res.send(snap);
        })
    } catch (error) {
        res.send(error)
    }
})
api.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await User.findById(id).find().then(result => {
            res.send(result);
        })
    } catch (error) {
        res.send(error)
    }
})
api.patch('updateRole/:id', async(req, res, next)=>{
    const id = req.params.id;
    const { username, nama, kota, nohp, email, password, role, img_none } = req.body;
    try {
        await User.findById(id).then(obj => {
                obj.username = username;
                obj.nama = nama;
                obj.kota = kota;
                obj.nohp = nohp;
                obj.email = email;
                obj.password = password;
                obj.role = role;
                obj.img_user = img_none;
                obj.save().then(result => {
                    res.send({ pesan: 'User menjadi mentor', data: result })
                })
            })
    } catch(error){
        res.send(error)
    }
})
api.patch('/:id', upload.single('img_user'), async (req, res, next) => {
    const id = req.params.id;
    const { username, nama, kota, nohp, email, password, role, img_none } = req.body;
    try {
        if (!req.file) {
            await User.findById(id).then(obj => {
                obj.username = username;
                obj.nama = nama;
                obj.kota = kota;
                obj.nohp = nohp;
                obj.email = email;
                obj.password = password;
                obj.role = role;
                obj.img_user = img_none;

                obj.save().then(result => {
                    res.send({ pesan: 'Berhasil Update', data: result })
                })
            })
        } else {
            await User.findById(id).then(obj => {
                obj.username = username;
                obj.nama = nama;
                obj.kota = kota;
                obj.nohp = nohp;
                obj.email = email;
                obj.password = password;
                obj.role = role;
                obj.img_user = req.file.filename;

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
        await User.findById(id).then(obj => {
            obj.remove().then(() => {
                res.send({ pesan: 'Berhasil di hapus' });
            })
        })
    } catch (error) {
        res.send(error)
    }
})
api.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        await User.findOne({
            $and: [
                { username: username },
                { password: password }
            ]
        }).then(result => {
            res.send({
                uid: result._id,
                username: result.username,
                role: result.role,
                nama : result.nama
            })
        }).catch(eror => {
            res.send({ pesan: 'Gagal login' })
            console.log(eror)
        })
    } catch (error) {
        res.send(error)
    }
})
module.exports = api;