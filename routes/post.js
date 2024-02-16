const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// import models
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');

// initialize database
const { populateAll } = require('../controllers/helper');

// import controller
const { getPostByUrl, createReply, deleteReply } = require('../controllers/postController');

router.get('/:title', populateAll, getPostByUrl, (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('post', { loggedIn: true, title: res.post.title, post: res.post, users: res.users });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message, post: res.post});
    }
})

router.post('/newReply', createReply, (req, res) => {
    try {
        // Send the new reply data
        const reply = {
            id: res.reply._id,
            title: res.reply.title,
            reply: res.reply.reply,
            date: res.reply.createdAtSGT,
            username: res.reply.poster.username,
            joinDate: res.reply.poster.joinDateMonth,
            role: res.reply.poster.role,
            roleClass: res.reply.poster.roleClass,
            postCount: res.reply.poster.postCount,
        }
        res.json(reply);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
})

router.delete('/', deleteReply, (req, res) => {
    try {
        // Send the new reply data
        res.json(res.message);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;