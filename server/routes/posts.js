// posts.js - Post routes

const express = require('express');
const Post = require('../models/Post');
const Category = require('../models/Category');
const User = require('../models/User');
const { protect, checkOwnership } = require('../middleware/auth');
const { validate, postSchemas, commentSchema } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    let filter = {};
    
    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Filter by published status (default to published only for public access)
    if (req.query.published !== undefined) {
      filter.isPublished = req.query.published === 'true';
    } else {
      filter.isPublished = true;
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const posts = await Post.find({
      $and: [
        { isPublished: true },
        {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { content: { $regex: q, $options: 'i' } },
            { excerpt: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
          ],
        },
      ],
    })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    })
      .populate('author', 'name email avatar bio')
      .populate('category', 'name slug color')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, validate(postSchemas.create), async (req, res) => {
  try {
    // Check if category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Add author to post data
    req.body.author = req.user._id;

    // Generate excerpt if not provided
    if (!req.body.excerpt && req.body.content) {
      req.body.excerpt = req.body.content.substring(0, 150) + '...';
    }

    const post = await Post.create(req.body);

    // Populate post data
    await post.populate([
      { path: 'author', select: 'name email avatar' },
      { path: 'category', select: 'name slug color' },
    ]);

    // Update counters
    await Promise.all([
      req.user.incrementPostCount(),
      category.incrementPostCount(),
    ]);

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (owner or admin)
router.put('/:id', protect, validate(postSchemas.update), async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post',
      });
    }

    // Check if category exists (if updating category)
    if (req.body.category && req.body.category !== post.category.toString()) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Category not found',
        });
      }
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name email avatar')
      .populate('category', 'name slug color');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    // Get category and author for counter updates
    const [category, author] = await Promise.all([
      Category.findById(post.category),
      User.findById(post.author),
    ]);

    await post.deleteOne();

    // Update counters
    await Promise.all([
      author?.decrementPostCount(),
      category?.decrementPostCount(),
    ]);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, validate(commentSchema), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.addComment(req.user._id, req.body.content);

    // Get updated post with populated comments
    const updatedPost = await Post.findById(req.params.id)
      .populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      data: updatedPost.comments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;