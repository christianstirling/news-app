const express = require('express')
const router = express.Router()

//Routes
router.get('', (req, res) => {
    const locals = {
        title: 'Ergo News App',
        description: 'News application prototype created with Mongo, Express, and Node'
    }

    console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>INDEX.EJS')
    console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
    res.render('index', { locals })
})

router.get('', (req, res) => {
    console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>INDEX.EJS')
    console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
    res.render('index')
})

router.get('/about', (req, res) => {
    console.log('* SERVER>ROUTES>MAIN: rendering VIEWS>ABOUT.EJS')
    console.log('* SERVER>ROUTES>MAIN: applying the layout from VIEWS>LAYOUTS>MAIN.EJS')
    res.render('about')
})

//Export
module.exports = router
