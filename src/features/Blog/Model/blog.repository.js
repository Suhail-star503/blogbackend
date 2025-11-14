import handleDatabaseError from "../../../errors/databaseError.js";
import { BlogModel } from "../Schema/blog.schema.js";

export default class BlogRepository {
    async postBlog(blogData) {
        try {
            const newBlog = new BlogModel(blogData);
            const savedBlog = await newBlog.save();
            return savedBlog;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    async getBlogById(id) {
        try {
            return await BlogModel.findById(id);
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    async getAllBlogs() {
        try {
            return await BlogModel.find().sort({ createdAt: -1 });
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    async deleteBlogById(id) {
        try {
            const deletedBlog = await BlogModel.findByIdAndDelete(id);
            return deletedBlog;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

}
