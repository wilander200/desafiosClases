const mongoose = require("mongoose");
const models = require("../models/User.js")

ReadFromDB();

async function ReadFromDB() {

    try {
        const URL = 'mongodb+srv://wilander200:Wilander.200@cluster0.pw5qlwv.mongodb.net/users?retryWrites=true&w=majority'

        let conection = await mongoose.connect(URL)
        console.log('Conexion OK')

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
}

module.exports = ClassUser;