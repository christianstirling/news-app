// /server/models/Admin.js

/**
 * Admin Model – Ergo News
 * 
 * Defines the schema for admin user accounts-who have access to the
 * backend content management system (CMS). Admins can log in,
 * create/edit/delete articles, and manage images.
 */

const mongoose = require('mongoose')
const Schema =mongoose.Schema



// ==============================
// AdminSchema
// ==============================

const AdminSchema = new Schema ({

    username: {
        type: String,
        required: true,     // Must be provided
        unique: true,       // No duplicate usernames allowed
        trim: true          // Remove surrounding whitespace
    },

    password: {
        type: String,   
        required: true      // Must be provided
    }
    
}, {
    timestamps: true        // Optional: adds createdAt and updatedAt fields
})


// Exports the model to app.js
module.exports = mongoose.model('Admin', AdminSchema)