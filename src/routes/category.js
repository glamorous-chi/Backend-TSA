import express from 'express';
import { createCategory } from '../controllers/category.js';
import { isAdmin, isLoggedIn } from '../middlewares/auth.js';

import { getAllCategories, getOneCategory, updateCategory, deleteCategory} from "../controllers/category.js"


const router = express.Router();
router.post('/create', isLoggedIn,isAdmin, createCategory)
router.get("/categories", getAllCategories)
router.get("/category/:categoryId", getOneCategory)
router.put("/update/:categoryId", updateCategory)
router.delete("/delete/:categoryId", deleteCategory)

export default router;