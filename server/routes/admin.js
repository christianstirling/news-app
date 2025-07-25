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

// Notes: maybe add additional GET routes that all lead to the login page, such as '/admin'
router.get('/admin/login', (req, res) => {
    res.render('admin/login', {
        layout: adminLayout, 
        error: null
    })
})

// POST: Login Form Submission
router.post('/admin/login', async (req, res) => {

    // Stores the username and password entered by the admin user at the login page
    const { username, password } = req.body

    try {

        // Finds the admin user at the corresponding username
        const admin = await Admin.findOne({ username })

        // What happens if the username cannot be found
        if(!admin) {
            return res.render('admin/login', {
                layout: adminLayout,
                error: 'Invalid username or password'
            })
        }

        // If the username is found, then make sure the password entered equals the
        // password stored in the database
        const isMatch = await bcrypt.compare(password, admin.password)

        // What happens if the passwords do not match
        if(!isMatch) {
            return res.render('admin/login', {
                layout: adminLayout,
                error: 'Invalid username or password'
            })
        }

        // Username and password match an account, then begin a 'logged in' session
        req.session.isAdmin = true
        req.session.adminId = admin._id

        // Redirect the logged in admin to the Admin Dashboard page
        res.redirect('/admin/dashboard')

    } catch (err) {
        console.log(err)
        res.status(500).send('Server error')
    }
})

// POST: Logout
router.post('/admin/logout', (req, res) => {
    // Ends the current session
    req.session.destroy(err => {
        if (err) { //check to see
            console.error('Error destroying session:', err)
            return res.status(500).send('Logout failed')
        }

        // Redirects the user to the login page
        res.redirect('/admin/login')
    })
})









// ==============================
// Admin Dashboard
// ==============================


// GET: Admin Dashboard Page - lists all of the articles with options to edit & delete

// Notes: Does this need to be async? Should I add a try-catch?
router.get('/admin/dashboard', isAuthenticated, async (req, res) => {

    // Finds all of the articles in the articles collection of the database,
    // sorts them by most recently UPDATED
    const articles = await Article.find({})
    .sort({ updatedAt: -1 })

    // Renders the Admin Dashboard page, loads it with all articles found
    res.render('admin/dashboard', {
        layout: adminLayout,
        articles
    })
})






// ==============================
// Create New Article Routes
// ==============================

// GET: Create New Article Page - contains a form where admin can submit article information for
//      a new article

// Notes: does this need to be async? Should I add a try-catch?
router.get('/admin/new', isAuthenticated, async (req, res) => {

    // Stores the path to the logo images directory
    const imgDir = path.join(__dirname, '../../public/img') 

    // Stores the current date formatted 'Month DD, YYYY'
    const today = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
    })

    // Uses the filesystem function readdir() to locate the directory identified by the 'imgDir'
    // filepath.
    fs.readdir(imgDir, (err, files) => {

        // Error for if the image directory cannot be found or read
        if (err) {
            console.error('Failed to read image directory', err)
            return res.status(500).json({ error: 'cannot read images' })
        }

        // Stores all of the images--all image files contained in the 'imgDir' directory
        const images = files.filter(file =>
            /\.(png|jpe?g|gif|svg)$/i.test(file)
        )

        // Render the page-passing the date and logo images to be used to populate the 
        // New Article submission form
        res.render('admin/new', {
            layout: adminLayout,
            images,
            today
        })
    })
})


// POST: Submit Create New Article Form - Sends the new article item to the articles database
//      collection
router.post('/admin/new', isAuthenticated, async (req, res) => {
    try {

        // Uses the Article model to create a new entry for the articles collection
        Article.create({
            image: req.body.image,
            categories: req.body.categories,
            title: req.body.title,
            source: req.body.source,
            date: req.body.date,
            summary: req.body.summary,
            link: req.body.link
        })

        // Redirects to the GET route for the dashboard--takes you back to admin home page
        res.redirect('dashboard')

    } catch (err) {
        console.log('Error', err)
        res.status(500).send('Server error')
    }
    
})







// ==============================
// Edit Existing Article Routes
// ==============================

//  GET: Edit Article Page - takes the admin user to the edit page for the selected
//      article.
//      Page contains a form populated with the article data for the given article item.
router.get('/admin/edit/:id', isAuthenticated, async (req, res) => {
    
    // Stores the ID for the selected article
    const { id } = req.params

    // Stores the path to the logo images directory
    const imgDir = path.join(__dirname, '../../public/img') 



    try {

        // Finds the selected article item inside the database
        const article = await Article.findById(id)

        // Error for if the article cannot be found
        if (!article) {
            return res.status(404).send('Article not found')
        }

        // Uses the filesystem function 'readdir()' to read the contents of the directory
        // located at the given filepath 'imgDir'
        fs.readdir(imgDir, (err, files) => {

            // Error for if it cannot locate the image directory or read the image files
            if (err) {
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            }
    
            // Stores all of the images located at 'imgDir'
            const images = files.filter(file =>
                /\.(png|jpe?g|gif|svg)$/i.test(file)
            )
    
            // Renders the Edit Artile page
            res.render('admin/edit', {
                layout: adminLayout,
                images,
                article
            })
        }) 

    } catch (err) {
        console.error('Failed to render page', err)
        res.status(500).send('Server error')
    }
})

// POST: Submit Edit Existing Article Form - sends in the new article data to update the
//      database item
router.post('/admin/edit/:id', isAuthenticated, async (req, res) => {

    // Stores the ID for the article that the user is editing
    const { id } = req.params

    try {

        // Finds the selected article item inside the database
        const article = await Article.findById(id)

        // Error for if the article cannot be found
        if(!article) {
            return res.status(404).send('Article not found')
        }

        // Modify the properties of the local article object
        article.image = req.body.image,
        article.categories = req.body.categories,
        article.title = req.body.title,
        article.source = req.body.source,
        article.date = req.body.date,
        article.summary = req.body.summary,
        article.link = req.body.link

        // Save the new article object in the database in place of the old one
        await article.save()

        // Redirect to the Dashboard page
        res.redirect('../dashboard')

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
    
})





// ==============================
// Delete Article Routes
// ==============================

// POST: Delete Article Button - deletes the selected article from the database
router.post('/admin/delete/:id', isAuthenticated, async (req, res) => {

    // Stores the ID of the selected article
    const { id } = req.params

    try {

        // Finds the article in the database and deletes it
        await Article.findByIdAndDelete(id)

        // Redirects the user to the Dashboard page
        res.redirect('../dashboard')

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})





// ==============================
// Photo Routes
// ==============================

// GET: View Logo Photos - lists all of the Article Logo photos currently stored 
//      in the front-end app files

// Notes: Does this need to be async? Can I get rid of the try-catch?
router.get('/admin/photo', isAuthenticated, async (req, res) => {

    // Stores the image directory path
    const imgDir = path.join(__dirname, '../../public/img') 


    try {

        // Uses the filesystem function 'readdir()' to read the files stored in the
        // imgDir directory
        fs.readdir(imgDir, (err, files) => {

            // Error if the directory cannot be found or read
            if (err) {
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            }
    
            // Stores the image files located in the given directory
            const images = files.filter(file =>
                /\.(png|jpe?g|gif|svg)$/i.test(file)
            )
    
            // Renders the View Photos page - passes the photos to the page
            res.render('admin/photo', {
                layout: adminLayout,
                images
            })
        }) 

    } catch (err) {
        console.error('Failed to render page', err)
        res.status(500).send('Server error')
    }
    
})


// POST: Delete Photo Button 

// Notes: Does this need to by async? Can I delete the try-catch too?
router.post('/admin/photo/delete/:image', isAuthenticated, async (req, res) => {

    // Stores the selected image name
    const { image } = req.params

    // Stores the image path (inside the directory) using the stored image name
    const imgPath = path.join(__dirname, `../../public/img/${image}`)

    try {

        // Uses the filesystem function 'unlink()' to delete the file at the given
        // file path 'imgPath'
        fs.unlink(imgPath, (err) => {

            // Error if the file at the given path cannot be found or read
            if (err) {
                console.error('***Failed to read image directory', err)
                return res.status(500).json({ error: 'cannot read images' })
            } 
            console.log('File deleted successfully.')

            // Redirects user back to the View Photos page
            res.redirect('..')
        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})




// GET: Render Rename Photo Page - contains a form that allow the user to enter a new name for the
// photo file
router.get('/admin/rename/:image', isAuthenticated, async (req, res) => {
    // Stores the image name
    const { image } = req.params

    try {

        // Renders the Rename Photo page
        res.render('admin/rename', {
            layout: adminLayout,
            image
        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})

// POST: Submit Rename Photo Form - submit the given new name for the photo, update the saved
// filename
router.post('/admin/rename', isAuthenticated, async (req, res) => {
    // Stores the current filename and the new name given by the user
    const { oldName, newName } = req.body

    // Error - cannot submit if either name is missing
    if (!oldName || !newName) {
        return res.status(400).send('Missing name value')
    }


    // Stores the directory where the image is located, pulls the extension from the old\
    // filename, then builds both the path where the file currently resides and the 
    // new path that will replace the old one
    const imgDir = path.join(__dirname, '../../public/img')
    const extension = path.extname(oldName)
    const oldPath = path.join(imgDir, oldName)
    const newPath = path.join(imgDir, newName + extension)  // '/public/img' + '/newname' + '.png' 
                                                            // = '/public/img/newname.png'

    try {

        // Uses the filesystem function 'rename()' to change the filename at the current path
        // of the selected file to the new filename at the new file path given by the user
        fs.rename(oldPath, newPath, (err) => {

            // Error if the image is not successfully renamed
            // Notes: not entirely familiar with what the error coming through here would look like,
            // built in with the rename function
            if(err) {
                console.error('Failed to rename image', err)
                return res.status(500).json({ error: 'cannot rename image' })
            }

            // Redirects the user to the View Photos page
            res.redirect('photo')

        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})



// GET: Render 'Upload New Photo' Page - contains a form where a user can upload a photo file from
// their computer and enter a name for the photo to be saved as in the app's public directory
router.get('/admin/upload', isAuthenticated, async (req, res) => {

    try {

        // Renders the upload page
        res.render('admin/upload', { layout: adminLayout })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})




// POST: Submit New Photo - submits the photo and name given in the Upload Photo form
router.post('/admin/upload', isAuthenticated, upload.single('imageFile'), (req, res) => {

    // Error if there is no image file entered
    if(!req.file) {
        return res.status(400).send('No file uploaded')
    }

    try {
        // Stores the the new image name given by the user and the extension
        // if the submitted image file
        const customName = req.body.filename
        const extension = path.extname(req.file.originalname)

        // The image file is automatically saved with its original name (the name of the
        // file on the user's computer) so here we build the new path using the desired
        // image name, then we call the rename function to rename the image file that
        // we just saved
        const oldPath = req.file.path
        const newPath = path.join(req.file.destination, customName + extension)

        fs.rename(oldPath, newPath, (err) => {

            // Error if the rename function fails
            if(err) {
                console.error('Failed to rename image', err)
                return res.status(500).json({ error: 'cannot rename image' })
            }

            // Redirects the user to the View Photos page
            res.redirect('photo')

        })

    } catch (err) {
        console.error('Error', err)
        res.status(500).send('Server error')
    }
})




// Exports the admin routes to main app file: app.js
module.exports = router