import express from 'express';
import { createProduct, deleteProductById, getAllProducts, getBySlug, getProductById, processPayment, relatedProduct, searchProduct, updateProduct} from '../controllers/product.js';
import { upload } from '../helpers/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', upload.array('images', 5), createProduct);
router.get("/all", getAllProducts)
router.get("/:productId", getProductById)
router.get("/slug/:slug", getBySlug)
router.post("/search", searchProduct)
router.get("/related/:productId", relatedProduct)
router.put("/update/:productId", upload.array('images', 5), updateProduct) //why?
router.delete("/:productId", deleteProductById)

// payments
router.post("/payment", isLoggedIn, processPayment)

export default router;