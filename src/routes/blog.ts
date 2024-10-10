import { Router } from "express";
import { blogController } from "../controller/db/BlogController";

const router = Router();


// Define routes and connect them to the controller
router.get('/', blogController.getBlogs);
router.get('/actifs', blogController.getActifsBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', blogController.createBlog);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);




export = router;