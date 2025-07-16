const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ArticleSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    categories: [{
        type: String,
        enum: ['Organizations', 'Academia', "Regulatory", "Industry", "Education", "Technology", "Health"] 
    }],
    title: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    
}, { timestamps: true })

module.exports = mongoose.model('Article', ArticleSchema)