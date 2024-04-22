import Order from "../models/order.js";
import moment from "moment";

export const orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }

        return res.status(200).json({ success: true, message: `Your order status has been changed to ${status}`, orderStatus: order.status })
    }
    catch (err) {
        console.error('Payment failed and order not processed', err.message);
        res.status(500).json({ success: false, message: 'Payment failed and order not processed', err: err.message });
    }
}

// Create the following endpoints
// Get All Orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
        res.json({ success: true, message: "Orders retrieved successfully", orders })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Get order by Id
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        return res.json({ success: true, message: "Order retrieved successfully", order })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Delete Order
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findByIdAndDelete(orderId)

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" })
        }
        res.json({ success: true, message: "Order deleted successfully" })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// search orders by date
// export const getOrdersByDate = async (req, res) => {
//     // Extract the date parameter from the request query
//     const { date } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5; // The limit parameter indicates the maximum number of items that the client wants to receive in a single response.
//     const skip = (page - 1) * limit;
//     try {
//         // Convert the date string to a JavaScript Date object
//         const searchDate = new Date(date);

//         // Construct the query to find orders with the specified date
//         const orders = await Order.find({
//             orderDate: { $gte: searchDate, $lt: new Date(searchDate.getTime() + 86400000) } // Adding 24 hours to include the entire day
//         }).skip(skip).limit(limit);

//         const totalOrders = await Order.countDocuments(orders);

//         res.status(200).json({
//             message: "Orders retrieved successfully",
//             currentPage: page,
//             ordersFound: totalOrders,
//             totalOrders: Math.ceil(totalOrders / limit),
//             orders
//         });
//     }
//     catch (err) {
//         console.error('Error searching orders by date:', err);
//         res.status(500).json({ message: 'Failed to search orders by date', err: err.message });
//     }
// };
export const searchOrdersByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body; //startDate is the date it starts from and endDate is the date it gets to

    if (!startDate && !endDate) {
      return res.status(400).json({ success: false, message: 'Start date or end date is required' });
    }

    let query = {};

    // Parse start date
    if (startDate) {
      const parsedStartDate = moment(startDate);
      console.log(parsedStartDate);

      if (!parsedStartDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid start date format' });
      }

      query.createdAt = { $gte: parsedStartDate.toDate() };
    }

    // Parse end date
    if (endDate) {
      const parsedEndDate = moment(endDate);
      console.log(parsedEndDate);

      if (!parsedEndDate.isValid()) {
        return res.status(400).json({ success: false, message: 'Invalid end date format' });
      }
  
      // If both start date and end date are provided, add $lte condition
      if (query.createdAt) {
        query.createdAt.$lte = parsedEndDate.toDate();
      } else {
        query.createdAt = { $lte: parsedEndDate.toDate() };
      }
    }

    const orders = await Order.find(query);

    res.status(200).json({ success: true, orders });
  } 
  catch (error) {
    console.error('Error searching orders by date:', error.message);
    res.status(500).json({ success: false, message: 'Failed to search orders', errorMsg: error.message });
  }
};