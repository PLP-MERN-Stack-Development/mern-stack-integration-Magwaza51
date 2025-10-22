// validation.js - Validation middleware using Joi

const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot be more than 50 characters',
      'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    bio: Joi.string().max(200).optional(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

// Post validation schemas
const postSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Title must be at least 3 characters long',
      'string.max': 'Title cannot be more than 100 characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().min(10).required().messages({
      'string.min': 'Content must be at least 10 characters long',
      'any.required': 'Content is required',
    }),
    excerpt: Joi.string().max(200).optional(),
    category: Joi.string().required().messages({
      'any.required': 'Category is required',
    }),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublished: Joi.boolean().optional(),
    featuredImage: Joi.string().optional(),
  }),
  update: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    content: Joi.string().min(10).optional(),
    excerpt: Joi.string().max(200).optional(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublished: Joi.boolean().optional(),
    featuredImage: Joi.string().optional(),
  }),
};

// Category validation schemas
const categorySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name cannot be more than 50 characters',
      'any.required': 'Category name is required',
    }),
    description: Joi.string().max(200).optional(),
    color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().messages({
      'string.pattern.base': 'Please provide a valid hex color',
    }),
  }),
};

// Comment validation schema
const commentSchema = Joi.object({
  content: Joi.string().min(3).max(500).required().messages({
    'string.min': 'Comment must be at least 3 characters long',
    'string.max': 'Comment cannot be more than 500 characters',
    'any.required': 'Comment content is required',
  }),
});

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    console.log('🔍 Validating request body:', req.body);
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      console.log('❌ Validation failed:', error.details);
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors,
      });
    }
    
    console.log('✅ Validation passed');
    next();
  };
};

module.exports = {
  validate,
  userSchemas,
  postSchemas,
  categorySchemas,
  commentSchema,
};