import express from 'express';
import { orderStatus, getAllOrders, getOrderById, deleteOrder, searchOrdersByDate} from '../controllers/order.js';

const router = express.Router();

// order status
router.put("/order-status/:orderId", orderStatus)

// order
router.get("/all", getAllOrders)
router.get("/order/:orderId", getOrderById)
router.delete("/delete/:orderId", deleteOrder)
router.post("/search", searchOrdersByDate)

export default router;