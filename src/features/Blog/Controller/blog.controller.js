import ApplicationError from "../../../errors/applicationError.js";
import BlogRepository from "../Model/blog.repository.js";

export default class BlogController {
    constructor() {
        this.blogRepository = new BlogRepository();
    }

    async postBlog(req, res, next) {
        try {
            const { title, content, author, tags, coverImage, published, socialLinks } = req.body;

            if (!title || !content || !author) {
                throw new ApplicationError("title, content and author are required", 400);
            }

            if (!Array.isArray(content) || content.length === 0) {
                throw new ApplicationError("content must be a non-empty array of blocks", 400);
            }

            const allowedTypes = new Set(["paragraph", "heading", "image", "list", "quote", "code"]);
            for (const [i, block] of content.entries()) {
                if (!block || typeof block !== "object") {
                    throw new ApplicationError(`content[${i}] must be an object`, 400);
                }
                if (!allowedTypes.has(block.type)) {
                    throw new ApplicationError(`content[${i}].type is invalid`, 400);
                }
                if (block.type === "heading") {
                    const lvl = parseInt(block.level);
                    if (!lvl || lvl < 1 || lvl > 6) {
                        throw new ApplicationError(`content[${i}].level must be an integer between 1 and 6`, 400);
                    }
                }
            }

            // ✅ Validate socialLinks (optional)
            let validSocialLinks = [];
            if (Array.isArray(socialLinks) && socialLinks.length > 0) {
                for (const [i, link] of socialLinks.entries()) {
                    if (!link.key || !link.value) {
                        throw new ApplicationError(`socialLinks[${i}] must have both key and value`, 400);
                    }
                    validSocialLinks.push({
                        key: link.key.trim().toLowerCase(),
                        value: link.value.trim(),
                    });
                }
            }

            // ✅ Include socialLinks in saved data
            const saved = await this.blogRepository.postBlog({
                title,
                content,
                author,
                tags,
                coverImage,
                published: !!published,
                socialLinks: validSocialLinks,
            });

            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: saved,
            });
        } catch (error) {
            next(error);
        }
    }


    // implement here getallBlogs method
    async getallBlogs(req, res, next) {
        try {
            const blogs = await this.blogRepository.getAllBlogs();

            if (!blogs || blogs.length === 0) {
                throw new ApplicationError("No blogs found", 404);
            }

            res.status(200).json({
                success: true,
                message: "All blogs fetched successfully",
                count: blogs.length,
                data: blogs,
            });
        } catch (error) {
            next(error);
        }
    }


    // 📘 Get single blog by ID
    async getBlogById(req, res, next) {
        try {
            const { id } = req.params;

            // ✅ Validate MongoDB ObjectId
            if (!id || id.length !== 24) {
                throw new ApplicationError("Invalid blog ID format", 400);
            }

            const blog = await this.blogRepository.getBlogById(id);

            if (!blog) {
                throw new ApplicationError("Blog not found", 404);
            }

            res.status(200).json({
                success: true,
                message: "Blog fetched successfully",
                data: blog,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlogById(req, res, next) {
        try {
            const { id } = req.params;

            if (!id || id.length !== 24) {
                throw new ApplicationError("Invalid blog ID format", 400);
            }

            const deletedBlog = await this.blogRepository.deleteBlogById(id);

            if (!deletedBlog) {
                throw new ApplicationError("Blog not found or already deleted", 404);
            }

            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
                data: deletedBlog,
            });
        } catch (error) {
            next(error);
        }
    }

}

