// 1. Import express.
import express from 'express';
import blogController from '../Controller/blog.controller.js';

// 2. Initialize Express router.
const blogRouter = express.Router();

// Contoller object to access controller functions.
const BlogController = new blogController();

// All the paths to controller methods.
// Authentication Routes

// Register a new user account.
blogRouter.post('/', (req, res, next) => {
    BlogController.postBlog(req, res, next);
})
blogRouter.get('/', (req, res, next) => {
    BlogController.getallBlogs(req, res, next);
})

blogRouter.get('/:id', (req, res, next) => {
    BlogController.getBlogById(req, res, next);
})
blogRouter.delete('/:id', (req, res, next) => {
    BlogController.deleteBlogById(req, res, next);
})

export default blogRouter;