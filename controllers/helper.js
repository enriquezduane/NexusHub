// import mongoose and models
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Reply = require('../models/replyModel');
const Board = require('../models/boardModel');
const Category = require('../models/categoryModel');

const populateAll = async (req, res, next) => {
    const categories = await Category.find().populate(
        {
            path: 'boards',
            populate: [
                { 
                    path: 'posts', 
                    model: 'Post', 
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                            populate: [
                                {
                                    path: 'posts',
                                    model: 'Post',
                                },
                                {
                                    path: 'replies',
                                    model: 'Reply',
                                }
                            ]
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                            populate: [
                                {
                                    path: 'refPost',
                                    model: 'Post'
                                },
                                {
                                    path: 'poster',
                                    model: 'User'
                                }
                            ]
                        },
                        {
                            path: 'refBoard',
                            model: 'Board',
                        }
                    ]
                },
                {
                    path: 'category',
                    model: 'Category',
                }
            ]
            
        });

    const boards = await Board.find().populate(
        { 
            path: 'posts', 
            model: 'Post', 
            populate: [
                { 
                    path: 'poster', 
                    model: 'User', 
                    populate: [
                        {
                            path: 'posts',
                            model: 'Post',
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                        }
                    ]
                },
                {
                    path: 'replies',
                    model: 'Reply',
                    populate: [
                        {
                            path: 'refPost',
                            model: 'Post'
                        },
                        {
                            path: 'poster',
                            model: 'User'
                        }
                    ]
                },
                {
                    path: 'refBoard',
                    model: 'Board',
                }
            ]
        }).populate('category');
    const posts = await Post.find().populate(
    { 
        path: 'poster', 
        model: 'User', 
        populate: [
            {
                path: 'posts',
                model: 'Post',
                populate: [
                    { 
                        path: 'poster', 
                        model: 'User', 
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    },
                    {
                        path: 'refBoard',
                        model: 'Board',
                    }
                ]
            },
            {
                path: 'replies',
                model: 'Reply',
                populate: [
                    {
                        path: 'refPost',
                        model: 'Post'
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            }
        ]
    }).populate(
    {
        path: 'replies',
        model: 'Reply',
        populate: [
            {
                path: 'refPost',
                model: 'Post',
                populate: [
                    { 
                        path: 'poster', 
                        model: 'User', 
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                        populate: [
                            {
                                path: 'refPost',
                                model: 'Post'
                            },
                            {
                                path: 'poster',
                                model: 'User'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'poster',
                model: 'User'
            }
        ]
    
    }).populate('refBoard');

    const replies = await Reply.find().populate('poster').populate('refPost');
    const users = await User.find().populate(
        { 
            path: 'posts', 
            model: 'Post', 
            populate: [
                { 
                    path: 'poster', 
                    model: 'User', 
                },
                {
                    path: 'replies',
                    model: 'Reply',
                    populate: [
                        {
                            path: 'refPost',
                            model: 'Post'
                        },
                        {
                            path: 'poster',
                            model: 'User'
                        }
                    ]
                },
                {
                    path: 'refBoard',
                    model: 'Board',
                }
            ]
        }).populate(
            {
                path: 'replies',
                model: 'Reply',
                populate: [
                    {
                        path: 'refPost',
                        model: 'Post',
                        populate: [
                            { 
                                path: 'poster', 
                                model: 'User', 
                            },
                            {
                                path: 'replies',
                                model: 'Reply',
                                populate: [
                                    {
                                        path: 'refPost',
                                        model: 'Post'
                                    },
                                    {
                                        path: 'poster',
                                        model: 'User'
                                    }
                                ]
                            },
                            {
                                path: 'refBoard',
                                model: 'Board',
                            }
                        ]
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            });

    res.categories = categories;
    res.boards = boards;
    res.posts = posts;
    res.replies = replies;
    res.users = users;

    next();
}

const populateCategories = async (categories) => {
    for (let i = 0; i < categories.length; i++) {
        categories[i] = await populatePost(categories[i]);
    }
    return categories;
}

const populateCategory = async (category) => {
    post = await Category.findById(category.id).populate(
        {
            path: 'boards',
            populate: [
                { 
                    path: 'posts', 
                    model: 'Post', 
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                            populate: [
                                {
                                    path: 'posts',
                                    model: 'Post',
                                },
                                {
                                    path: 'replies',
                                    model: 'Reply',
                                }
                            ]
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                            populate: [
                                {
                                    path: 'refPost',
                                    model: 'Post'
                                },
                                {
                                    path: 'poster',
                                    model: 'User',
                                    populate: [
                                        {
                                            path: 'posts',
                                            model: 'Post',
                                        },
                                        {
                                            path: 'replies',
                                            model: 'Reply',
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ]
        });
    return post;
}

const populateBoards = async (boards) => {
    for (let i = 0; i < boards.length; i++) {
        boards[i] = await populateBoard(boards[i]);
    }

    return boards;
}

const populateBoard = async (board) => {
    board = await Board.findById(board.id).populate(
    { 
        path: 'posts', 
        model: 'Post', 
        populate: [
            { 
                path: 'poster', 
                model: 'User', 
                populate: [
                    {
                        path: 'posts',
                        model: 'Post',
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    }
                ]
            },
            {
                path: 'replies',
                model: 'Reply',
                populate: [
                    {
                        path: 'refPost',
                        model: 'Post'
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            },
            {
                path: 'refBoard',
                model: 'Board',
            }
        ]
    }).populate('category');

    return board;
}


const populatePosts = async (posts) => {
    for (let i = 0; i < posts.length; i++) {
        posts[i] = await populatePost(posts[i]);
    }
    return posts;
}

const populatePost = async (post) => {
    post = await Post.findById(post.id).populate(
        { 
            path: 'poster', 
            model: 'User', 
            populate: [
                {
                    path: 'posts',
                    model: 'Post',
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                        }
                    ]
                },
                {
                    path: 'replies',
                    model: 'Reply',
                    populate: [
                        {
                            path: 'refPost',
                            model: 'Post'
                        },
                        {
                            path: 'poster',
                            model: 'User'
                        }
                    ]
                }
            ]
        }).populate(
        {
            path: 'replies',
            model: 'Reply',
            populate: [
                {
                    path: 'refPost',
                    model: 'Post',
                    populate: [
                        { 
                            path: 'poster', 
                            model: 'User', 
                        },
                        {
                            path: 'replies',
                            model: 'Reply',
                            populate: [
                                {
                                    path: 'refPost',
                                    model: 'Post'
                                },
                                {
                                    path: 'poster',
                                    model: 'User'
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'poster',
                    model: 'User'
                }
            ]
    }).populate('refBoard');
    return post;
}

const populateReplies = async (replies) => {
    replies = await Reply.findById(replies.id).populate({
        path: 'refPost',
        model: 'Post',
        populate: [
            { 
                path: 'poster', 
                model: 'User', 
                populate: [
                    {
                        path: 'posts',
                        model: 'Post',
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    }
                ]
            },
            {
                path: 'replies',
                model: 'Reply',
                populate: [
                    {
                        path: 'refPost',
                        model: 'Post'
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            }
        ]
    }).populate({
        path: 'poster',
        model: 'User',
        populate: [
            {
                path: 'posts',
                model: 'Post',
            },
            {
                path: 'replies',
                model: 'Reply',
            }
        ]
    });
    return replies;
}

const populateReply = async (reply) => {
    reply = await Reply.findById(reply.id).populate({
        path: 'refPost',
        model: 'Post',
        populate: [
            { 
                path: 'poster', 
                model: 'User', 
                populate: [
                    {
                        path: 'posts',
                        model: 'Post',
                    },
                    {
                        path: 'replies',
                        model: 'Reply',
                    }
                ]
            },
            {
                path: 'replies',
                model: 'Reply',
                populate: [
                    {
                        path: 'refPost',
                        model: 'Post'
                    },
                    {
                        path: 'poster',
                        model: 'User'
                    }
                ]
            }
        ]
    }).populate({
        path: 'poster',
        model: 'User',
        populate: [
            {
                path: 'posts',
                model: 'Post',
            },
            {
                path: 'replies',
                model: 'Reply',
            }
        ]
    });
    return reply;
}

const highlightSubstring = (content, searchText) => {
    // Split the content into parts where the search query occurs
    const parts = content.split(new RegExp(`(${searchText})`, 'gi'));

    // Rebuild the content with styled HTML
    return parts.map(part => part.toLowerCase() === searchText.toLowerCase() ? `<strong style="color: #ff9200;">${part}</strong>` : part).join('');
}

const formatLatestPostDate = (post) => {
    return moment(post.createdAt).tz('Asia/Singapore').format('MMM DD [at] hh:mm A');
}

module.exports = {
    populateAll,
    populateCategories,
    populateCategory,
    populateBoards,
    populateBoard,
    populatePosts,
    populatePost,
    populateReplies,   
    populateReply,
    highlightSubstring,
    formatLatestPostDate,
}