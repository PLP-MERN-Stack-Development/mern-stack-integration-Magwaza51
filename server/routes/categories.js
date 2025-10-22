// categories.js - Category routes

const express = require('express');
const Category = require('../models/Category');
const Post = require('../models/Post');
const { protect, authorize } = require('../middleware/auth');
const { validate, categorySchemas } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Get posts in this category (optional, with pagination)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ 
      category: category._id, 
      isPublished: true 
    })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ 
      category: category._id, 
      isPublished: true 
    });

    res.status(200).json({
      success: true,
      data: {
        category,
        posts: {
          data: posts,
          count: posts.length,
          total: totalPosts,
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), validate(categorySchemas.create), async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `Category with this ${field} already exists`,
      });
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        error: `Category with this ${field} already exists`,
      });
    }

    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    // Check if category has posts
    const postCount = await Post.countDocuments({ category: category._id });
    
    if (postCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category. It has ${postCount} post(s) associated with it`,
      });
    }

    await category.deleteOne();

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

// @desc    Get category statistics
// @route   GET /api/categories/stats
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Category.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'category',
          as: 'posts',
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          color: 1,
          postCount: { $size: '$posts' },
          publishedPostCount: {
            $size: {
              $filter: {
                input: '$posts',
                cond: { $eq: ['$$this.isPublished', true] },
              },
            },
          },
        },
      },
      {
        $sort: { publishedPostCount: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;