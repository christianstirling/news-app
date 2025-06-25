const mongoose = require('mongoose')
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect('mongodb+srv://cls:db-password-example@cluster0.lglyvc4.mongodb.net/news-app')
        console.log(`* * SERVER>CONFIG>DB: database connected - ${conn.connection.host}`)
    } catch (error) {
        console.log('* * SERVER>CONFIG>DB: error connecting database!')
    }
}
module.exports = connectDB