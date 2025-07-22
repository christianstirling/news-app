// app.js


/**
 * Ergo News - Server Initialization
 * 
 * Sets up the Express application, connects to MongoDB, 
 * configures session management, registers templating and routes.
 * 
 * Author: Christian Stirling
 * Owner: Saturn Ergonomics
 * 
 * Environment: Node.js, Express, MongoDB
 */

require('dotenv').config() // Load environment variables from .env



// ==============================
// 1. Module Imports & Config
// ==============================

const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const expressLayout = require('express-ejs-layouts')

const app = express()
const PORT = 3000 || process.env.PORT



// ==============================
// 2. Database Connection
// ==============================

const connectDB = require('./server/config/db')
connectDB()



// ==============================
// 3. Express App Setup
// ==============================

// Parse URL-encoded form data (from HTML forms)
app.use(express.urlencoded({ extended: false }))

// Serve static files from the "public" directory
app.use(express.static('public'))



// ==============================
// 4. Session Middleware
// ==============================

app.use(session({
    secret: process.env.SESSION_SECRET,     // Secret code used to sign and verify session cookies
    resave: false,                          // Prevents session from being saved unless modified
    saveUninitialized: false,               // Don't create empty sessions
    store: MongoStore.create({              
        mongoUrl: process.env.MONGO_URI     // MongoDB cluster for storing session data
    }),
    cookie: {
        maxAge: 1000*60*60,                 // Length of session - 1 hour
        httpOnly: true,                     // Prevent client-side code from accessing cookie
        secure: false                       // Set to true if serving over HTTPS in prod
    }
}))



// ==============================
// 5. View Engine Setup (EJS)
// ==============================

app.use(expressLayout)                              // use express-ejs-layouts for layout support
app.set('layout', 'layouts/main')                   // Default layout template for main app page
app.set('views', path.join(__dirname, 'views'))     // Sets absolute path to Views directory
app.set('view engine', 'ejs')                       // Sets EJS as the view engine



// ==============================
// 6. Routing
// ==============================


app.use('/', require('./server/routes/main'))       // Main public routes (main app homepage)

app.use('/', require('./server/routes/admin'))      // Admin routes (e.g., login, dashboard, edit)



// ==============================
// 7. Start the Server
// ==============================

app.listen(PORT, () => {
    console.log(`app listening: port ${PORT}`)
})