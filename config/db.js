const mongo = require('mongoose');
const host = require('./server').host;

class Database{
    constructor() {
        this.koneksiServer();
    }
    async koneksiServer(){
        try {
            await mongo.connect(host,{ useNewUrlParser:true, useUnifiedTopology : true });
            console.log('Koneksi mongoDb tersambung')
        } catch (error) {
            console.log(error)
        }
    }
}

exports.db = new Database();

