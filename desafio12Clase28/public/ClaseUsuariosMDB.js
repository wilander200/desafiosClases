const mongoose = require("mongoose");
const models = require("../models/User.js")
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv').config()

//LLAMADO A LOS DATOS DEL DOTENV
const urlUsers = process.env.URL_USERS_MONGODB

ReadFromDB();

async function ReadFromDB() {

    try {
        const URL = 'mongodb+srv://wilander200:Wilander.200@cluster0.pw5qlwv.mongodb.net/users?retryWrites=true&w=majority'

        let conection = await mongoose.connect(URL)
        console.log('Conexion a base de datos usuarios OK')

        return
    } catch (error) {
        console.log(error)
    }
}

class ClassUser {
    constructor() {

    }

    async getAll() {
        const users = await models.find()
        return users
    }

    async saveUser({username , password}) {
        const newUser = await models.create({
            username: username,
            password: password
        })
    console.log('se pudo guardar el usuario correctamente')
    return newUser
    }

    async encryptPassword (password) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }
    
    async matchPassword (password , userLog) {
        return await bcrypt.compare(password, userLog)
    }

}

module.exports = ClassUser;