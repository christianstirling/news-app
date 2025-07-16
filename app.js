require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')
const path = require('path')

const connectDB = require('./server/config/db')

const app = express()
const PORT = 3000 || process.env.PORT

connectDB()






// create session:

const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
    secret: process.env.SESSION_SECRET, // secret code used to sign and verify session cookies
    resave: false, // doesn't save session if nothing has been modified
    saveUninitialized: false, // don't create empty sessions
    store: MongoStore.create({ // stores sessions inside mongo db
        mongoUrl: process.env.MONGO_URI // mongo db connection string
    }),
    cookie: {
        maxAge: 1000*60*60, // length of session - 1 hour
        httpOnly: true, // prevent client-side code from accessing cookie
        secure: false // set to true if serving over HTTPS in prod
    }
}))








app.use(express.static('public'))

// Templating engine

app.use(expressLayout)

app.set('layout', 'layouts/main')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))


















// importing routes:

app.use('/', require('./server/routes/main')) // import main app routes

app.use('/', require('./server/routes/admin')) // import admin routes






app.listen(PORT, () => {
    console.log(`app listening: port ${PORT}`)
})