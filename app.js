require('dotenv').config()

const express = require('express')
const expressLayout = require('express-ejs-layouts')

const app = express()
const PORT = 3000 || process.env.PORT

app.use(express.static('public'))

// Templating engine

app.use(expressLayout)

app.set('layout', './layouts/main')
// console.log('* APP: setting LAYOUT to MAIN in VIEWS>LAYOUTS')

app.set('view engine', 'ejs')
// console.log('* APP: setting VIEW ENGINE to EJS')



app.use('/', require('./server/routes/main'))
// console.log('* APP: importing ROUTES from SERVER')






app.listen(PORT, () => {
    console.log(`* APP: listening on port ${PORT}`)
})