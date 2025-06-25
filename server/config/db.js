const mongoose = require('mongoose')
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`* * SERVER>CONFIG>DB: database connected - ${conn.connection.host}`)
    } catch (error) {
        console.log('* * SERVER>CONFIG>DB: error connecting database!')
    }
}
module.exports = connectDB