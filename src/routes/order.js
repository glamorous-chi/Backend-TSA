import express from 'express';
import { orderStatus, getAllOrders, getOrderById, deleteOrder, getOrdersByDate } from '../controllers/order.js';

const router = express.Router();

// order status
router.put("/order-status/:orderId", orderStatus)

// order
router.get("/all", getAllOrders)
router.get("/order/:orderId", getOrderById)
router.delete("/delete/:orderId", deleteOrder)
router.get("/search", getOrdersByDate)

export default router;