// server/routes/main.js

/**
 * Main Public Routes – Ergo News
 *
 * Handles user-facing routes to the app homepage.
 * 
 * Uses JSON API for article filtering and pagination
 */

const express = require('express')
const router = express.Router()
const Article = require('../models/Article')



// ==========================================
// Route:   GET /   (Homepage)
// Desc:    Renders the homepage with the latest articles
// View:    views/main/index.ejs
// ==========================================

router.get('/', async (req, res) => {

    try {
        const articles = await Article.find({})     // Fetch all articles
        res.render('main/index', { articles })

    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }

})




// ==========================================
// Route: GET /articles
// Desc: Returns filtered + paginated article data as JSON
// Usage: Called via frontend JS for AJAX-based filtering
// Query Params:
//   - categories: comma-separated list of categories
//   - searchText: text to search in title or summary
//   - page: page number (default = 1)
//   - perPage: results per page (default = 3)
// ==========================================

router.get('/articles', async (req, res) => {

    const { categories, searchText, page = 1, perPage = 3 } = req.query
    let filter = {}

    // Filter by selected categories
    if (categories) {
        const categoryList = categories.split(',')
        filter.categories = { $in: categoryList }
    }

    // Filter by search text in title or summary
    if (searchText) {
        const searchRegex = new RegExp(searchText, 'i')     // case-insensitive
        filter.$or = [
            { title: searchRegex },
            { summary: searchRegex }
        ]
    }

    const skip = (Number(page) - 1) * Number(perPage)

    try {
        // Fetch filtered + paginated articles
        const articles = await Article.find(filter)
            .skip(skip)
            .sort({ createdAt: -1 })
            .limit(Number(perPage))

        // Count total matching documents
        const total = await Article.countDocuments(filter)

        res.json({
            articles,
            hasMore: skip + articles.length < total         // for pagination
        })

    } catch (err) {
        console.error(err)
        res.status(500).send('Server error')
    }

})




// ==========================================
// Export the router to be used in app.js
// ==========================================

module.exports = router
