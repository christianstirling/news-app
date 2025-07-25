// /server/models/Article.js

/**
 * Article Model – Ergo News
 * 
 * Defines the schema for news articles displayed in the app.
 * Articles include metadata, a summary, source info, and category tags.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema


// ==============================
// Article Schema
// ==============================

const ArticleSchema = new Schema({

    image: {                // Relative path to the article logo image
        type: String,
        required: true
    },

    categories: [{          // Category tags for filtering and UI
        type: String,
        enum: [
            'Organizations', 
            'Academia', 
            "Regulatory", 
            "Industry", 
            "Education", 
            "Technology", 
            "Health"
        ] 
    }],

    title: {                // Headline or article title
        type: String,
        required: true
    },

    source: {               // Name of the source (e.g., NIOSH, OSHA)
        type: String,
        required: true
    },

    date: {                 // Publication date as a formatted string
        type: String,
        required: true
    },

    summary: {              // AI-generated article summary
        type: String,
        required: true
    },

    link: {                 // URL to the original article
        type: String,
        required: true
    },

    createdAt: {            // Fallback in case timestamps are disabled
        type: Date,
        default: Date.now
    },

    updatedAt: {            // Fallback in case timestamps are disabled
        type: Date,
        default: Date.now
    }
    
}, { 
    timestamps: true        // Automatically adds `createdAt` and `updatedAt`
})


// Exports the Article model to app.js
module.exports = mongoose.model('Article', ArticleSchema)