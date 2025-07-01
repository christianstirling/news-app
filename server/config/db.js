const mongoose = require('mongoose')
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect('mongodb+srv://cls:db-password-example@cluster0.lglyvc4.mongodb.net/news-app')
        console.log(`database connected: ${conn.connection.host}`)
    } catch (error) {
        console.log('error! database NOT connected')
    }
}
module.exports = connectDB