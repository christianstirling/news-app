// server/routes/admin.js

/**
 * Admin Routes – Ergo News
 * 
 * Handles authentication, article management (CRUD),
 * and image management (upload, rename, delete).
 */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')




// ==============================
// Models and Config
// ==============================

const Article = require('../models/Article')
const Admin = require('../models/Admin')
const adminLayout = 'layouts/admin'




// ==============================
// Middleware: Auth Check
// ==============================

function isAuthenticated(req, res, next) { // middleware to check if the user is authenticated
    if (req.session && req.session.isAdmin) {
      return next()
    }
    res.redirect('/admin/login')
}




// ==============================
// Multer Config for Image Uploads
// ==============================

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/img'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })




// ==============================
// Admin Auth Routes
// ==============================

// GET: Login Page - views/admin/login
router.get('/admin/login', (req, res) => {
    res.render('admin/login', {
        layout: adminLayout, 
        error: null
    })
})

// POST: Login Form Submission
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const admin = await Admin.findOne({ username })

        if(!admin) {
            return res.render('admin/login', {
                layout: adminLayout,
                error: 'Invalid username or password'
            })
        }

        const isMatch = await bcrypt.compare(password, admin.password)

        if(!isMatch) {
            return res.render('admin/login', {
                layout: adminLayout,
                error: 'Invalid username or password'
            })
        }

        req.session.isAdmin = true
        req.session.adminId = admin._id

        res.redirect('/admin/dashboard')
    } catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

// POST: Logout
router.post('/admin/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) { //check to see
            console.error('Error destroying session:', err)
            return res.status(500).send('Logout failed')
        }

        res.redirect('/admin/login')
    })
})



















router.get('/api/images', (req, res) => {
    
})





async function createArticle(title, categories, source, date, image, summary, link) {
    Article.create({
        image,
        categories,
        title,
        source,
        date,
        summary,
        link
    })
}






// dashboard that shows the articles

router.get('/admin/dashboard', isAuthenticated, async (req, res) => {
    const articles = await Article.find({})
    .sort({ updatedAt: -1 })

    res.render('admin/dashboard', {
        layout: adminLayout,
        articles
    })
})







// --------- new ------------

// gets the page containing the new article form

router.get('/admin/new', isAuthenticated, async (req, res) => {
    const imgDir = path.join(__dirname, '../../public/img') 
    // stores the path to the logo images directory

    const date = new Date()
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    })
    // stores the current date formatted Month DD, YYYY

    fs.readdir(imgDir, (err, files) => {
        if (err) {
            console.error('***Failed to read image directory', err)
            return res.status(500).json({ error: 'cannot read images' })
        }

        const images = files.filter(file =>
            /\.(png|jpe?g|gif|svg)$/i.test(file)
        )
        // stores all of the images

        res.render('admin/new', {
            layout: adminLayout,
            images,
            today: formattedDate
        })
        // render the page
    })
})


// post -- when the new article is submitted from the new article creation form

router.post('/admin/new', isAuthenticated, async (req, res) => {
    try {
        Article.create({
            image: req.body.image,
            categories: req.body.categories,
            title: req.body.title,
            source: req.body.source,
            date: req.body.date,
            summary: req.body.summary,
            link: req.body.link
        })

        res.redirect('dashboard')
    } catch (err) {

        console.log('Error', err)
        res.status(500).send('Server error')
    }
    
})









/* ------------------ edit ------------------ */

router.get('/admin/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params

    const imgDir = path.join(__dirname, '../../public/img') 
    // stores the path to the logo images directory



    try {
        const article = await Article.findById(id)
        if (!article) {
            return res.status(404).send('Article not found')
        }

        fs.readdir(imgDir, (err, files) => {
            if (err) {
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            }
    
            const images = files.filter(file =>
                /\.(png|jpe?g|gif|svg)$/i.test(file)
            )
            // stores all of the images
    
            res.render('admin/edit', {
                layout: adminLayout,
                images,
                article
            })
            // render the page
        }) 
    } catch (err) {
        console.error('Failed to render page', err)
        res.status(500).send('Server error')
    }
})


router.post('/admin/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params

    try {
        const article = await Article.findById(id)

        if(!article) {
            return res.status(404).send('Article not found')
        }

        article.image = req.body.image,
        article.categories = req.body.categories,
        article.title = req.body.title,
        article.source = req.body.source,
        article.date = req.body.date,
        article.summary = req.body.summary,
        article.link = req.body.link

        await article.save()

        res.redirect('../dashboard')

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
    
})










/* ---------------delete --------------*/

router.post('/admin/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params
    try {
        await Article.findByIdAndDelete(id)

        res.redirect('../dashboard')
    } catch (err) {

        console.error('Error', err)
        res.status(500).send('Server error')
    }
})








/* --------------- photos --------------*/

router.get('/admin/photo', isAuthenticated, async (req, res) => {

    const imgDir = path.join(__dirname, '../../public/img') 


    try {

        fs.readdir(imgDir, (err, files) => {

            if (err) { // checks for error with locating the image files
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            }
    
            const images = files.filter(file =>
                /\.(png|jpe?g|gif|svg)$/i.test(file) // filters for real images
            )
            // stores all of the images
    
            res.render('admin/photo', {
                layout: adminLayout,
                images
            })
            // render the page
        }) 

    } catch (err) { // server error
        console.error('Failed to render page', err)
        res.status(500).send('Server error')
    }
    

})

// delete photo

router.post('/admin/photo/delete/:image', isAuthenticated, async (req, res) => {
    const { image } = req.params
    const imgDir = path.join(__dirname, `../../public/img/${image}`)

    try {

        fs.unlink(imgDir, (err) => {
            if (err) {
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            } 
            console.log('File deleted successfully.')

            res.redirect('..')
        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})





// rename GET route

router.get('/admin/rename/:image', isAuthenticated, async (req, res) => {
    const { image } = req.params

    try {

        res.render('admin/rename', {
            layout: adminLayout,
            image
        })
    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})

// rename POST

router.post('/admin/rename', isAuthenticated, async (req, res) => {
    console.log(req.body)
    const { oldName, newName } = req.body

    if (!oldName || !newName) {
        return res.status(400).send('Missing name value')
    }

    const imgDir = path.join(__dirname, '../../public/img')
    const extension = path.extname(oldName)
    const oldPath = path.join(imgDir, oldName)
    const newPath = path.join(imgDir, newName + extension)

    try {

        fs.rename(oldPath, newPath, (err) => {
            if(err) {

                console.error('Failed to rename image', err)
                return res.status(500).json({ error: 'cannot rename image' })
            }


        console.log(`Image renamed successfully: ${newName+extension}`)
        res.redirect('photo')

        })
    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})








// get route for the upload photo page 

router.get('/admin/upload', isAuthenticated, async (req, res) => {


    try {

        res.render('admin/upload', { layout: adminLayout })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})





router.post('/admin/upload', isAuthenticated, upload.single('imageFile'), (req, res) => {

    if(!req.file) {
        return res.status(400).send('No file uploaded')
    }

    try {

        const customName = req.body.filename
        const extension = path.extname(req.file.originalname)

        const oldPath = req.file.path
        const newPath = path.join(req.file.destination, customName + extension)
        fs.rename(oldPath, newPath, (err) => {
            if(err) {

                console.error('Failed to rename image', err)
                return res.status(500).json({ error: 'cannot rename image' })
            }


        console.log(`Image uploaded successfully: ${req.body.filename}`)
        res.redirect('photo')

        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})








module.exports = router