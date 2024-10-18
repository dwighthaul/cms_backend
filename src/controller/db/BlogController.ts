import { Request, Response } from "express";
import { Blog } from "../../model/dto/db/Blog";
import { SQLConnection } from "./SQLConnection";


class BlogController {
	sqlConnection: SQLConnection;


	async getBlog() {
		return await Blog.findAll();
	}

	// Get all blogs
	getBlogs = async (req: Request, res: Response) => {
		try {
			const blogs = await Blog.findAll({ order: [['id', 'DESC'], ['updatedAt', 'ASC']] });
			res.json(blogs);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	};

	// Get all blogs
	getActifsBlogs = async (req: Request, res: Response) => {
		try {
			const blogs = await Blog.findAll({ where: { is_actif: true }, order: [['updatedAt', 'DESC']] });
			res.json(blogs);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	};

	// Get a single blog by ID
	getBlogById = async (req: Request, res: Response) => {
		try {
			const blog = await Blog.findById(req.params.id);
			if (!blog) return res.status(404).json({ message: 'Blog not found' });
			res.json(blog);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	};

	// Create a new blog
	createBlog = async (req: Request, res: Response) => {
		const { name, content, is_actif } = req.body;
		const blog = new Blog();
		blog.name = name
		blog.content = content
		blog.is_actif = is_actif

		try {
			const savedBlog = await blog.save();
			res.status(201).json(savedBlog);
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	};

	// Update an existing blog
	updateBlog = async (req: Request, res: Response) => {

		try {
			const { id } = req.params;
			const { name, content, is_actif } = req.body;

			const blog = await Blog.findByPk(id);

			if (!blog) {
				return res.status(404).json({ error: 'Blog not found' });
			}

			blog.name = name
			blog.content = content
			blog.is_actif = is_actif

			await blog.save();
			res.status(200).json();
		} catch (error) {
			res.status(500).json({ error: 'Failed to update role' });
		}


	};

	// Delete an blog
	deleteBlog = async (req: Request, res: Response) => {

		try {
			const deletedBlog = await Blog.destroy({
				where: {
					id: req.params.id
				},
			})
			if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
			res.json({ message: 'Blog deleted' });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	};



}
const blogController = new BlogController();

export { blogController };

