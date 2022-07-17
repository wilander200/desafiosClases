const mongoose = require('mongoose')

const userCollection = 'users'

const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
})

module.exports = mongoose.model(userCollection, UsersSchema)

