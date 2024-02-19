const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const User = require('../models/userModel');
const { populatePost, populateReply } = require('./helper');

const renderCreatePost = (req, res) => {
    try {
        // Render the create post page
        res.render('createPost', { 
            loggedIn: true, 
            title: 'Create Post', 
            forumRules: res.forumRules, 
            userLoggedIn: 
            res.userLoggedIn 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const renderPost = (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('post', { 
            loggedIn: true, 
            title: res.post.title, 
            post: res.post, 
            users: res.users, 
            forumRules: res.forumRules, 
            userLoggedIn: res.userLoggedIn 
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message, post: res.post});
    }
}

// Get post by URL
const getPostByUrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found', post: post });
        } else {
            res.post = await populatePost(post);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    next();
}

// Increment views
const incrementViews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        // Check if the cookie exists
        if (!req.cookies[`viewed_${id}`]) {
            // Increment the view count
            post.views += 1;
            await post.save();

            // Set a cookie to expire in desired time in milliseconds (CURRENT: 1 minute)
            res.cookie(`viewed_${id}`, true, { maxAge: 1000 * 60 });

            console.log('View count incremented for post:', post.title);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
    next();
};

const createPost = async (req, res, next) => {
    try {
        const { title, content, boardId } = req.body;
        const user = await User.findOne({username: "lokitrickster"}); // No session management yet, placeholder username

        // Create a new post
        const initialPost = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            refBoard: boardId,
            content: content,
            poster: user.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        // Save the new post
        const post = await initialPost.save();

        // send the post id to the client
        res.status(200).json({ id: post.id });
    } catch (err) {
        res.status(400).json({ message: err.message, request: req.body });
    }
}


// Create a new reply
const createReply = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        
        // Find the post and user by its ID
        const initialPost = await Post.findById(postId);
        const user = await User.findOne({username: "lokitrickster"}); // No session management yet, placeholder username

        // Populate the post object
        const post = await populatePost(initialPost);

        // Create a new reply
        const initialReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            title: 'Re: ' + post.title,
            refPost: post.id,
            poster: user.id,
            reply: content,
            createdAt: Date.now(),
            updatedAt: Date.now() 
        });

        // save the new reply
        const reply = await initialReply.save();

        // populate the new reply object
        populatedReply = await populateReply(reply);

        replyMsg = {
            id: populatedReply.id,
            userId: populatedReply.poster.id,
            title: populatedReply.title,
            reply: populatedReply.reply,
            date: populatedReply.createdAtSGT,
            username: populatedReply.poster.username,
            joinDate: populatedReply.poster.joinDateMonth,
            role: populatedReply.poster.role,
            roleClass: populatedReply.poster.roleClass,
            postCount: populatedReply.poster.postCount,
            edited: populatedReply.edited,
            updatedAtSGT: populatedReply.updatedAtSGT
        }

        // Send the new reply object to the client
        res.status(200).json(replyMsg);
    } catch (err) {
        res.status(400).json({ message: err.message, request: req.body });
    }
};

// Delete reply
const deleteContent = async (req, res, next) => {
    try {
        const { type, id } = req.body;

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            // Delete the post
            await post.deleteOne();

            res.status(200).json({ message: 'Post deleted successfully' });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            // Delete the reply
            await reply.deleteOne();
            
            res.status(200).json({ message: 'Reply deleted successfully' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateContent = async (req, res, next) => {
    try {
        const { type, id, content } = req.body;

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            // Update the post
            post.content = content;
            post.updatedAt = Date.now();
            await post.save();

            res.status(200).json({ updatedAt: post.updatedAtSGT });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            // Update the reply
            reply.reply = content;
            reply.updatedAt = Date.now();
            await reply.save();

            res.status(200).json({ updatedAt: reply.updatedAtSGT });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const upvote = async (req, res, next) => {
    try {
        const { type, id, count } = req.body;

        if (type === 'post') {
            console.log('Upvoting post')
            // Find the post
            const post = await Post.findById(id);

            // Update the post
            post.upvotes = count;
            await post.save();
        } else {
            console.log('Upvoting reply')
            // Find the reply
            const reply = await Reply.findById(id);

            // Update the reply
            reply.upvotes = count;
            await reply.save();
        }

        // Send a success response
        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    renderCreatePost,
    renderPost,
    getPostByUrl,
    incrementViews,
    createPost,
    createReply,
    deleteContent,
    updateContent,
    upvote,
};
