import { connectDb } from "./src/db.config.js";
// import dotenv from "dotenv";
import cors from 'cors'
import express from "express";
import userRouter from "./src/routes/user.js"
import authRouter from "./src/routes/auth.js"
import categoryRouter from "./src/routes/category.js"
import productRouter from "./src/routes/product.js"
import orderRouter from "./src/routes/order.js"

// dotenv.config();

// initialize express server
const app = express();
app.use(express.json())

let corsOptions = { 
    origin : ['http://localhost:5173',"https://fragrancehub-chiomas-projects-503ed07e.vercel.app", 'http://localhost:5174', 'http://localhost:3000'], 
  } 
app.use(cors(corsOptions)); //these are the cors allowed origin

const port = process.env.PORT
const dbUrl = process.env.MONGODB_URL
console.log(port);
console.log(dbUrl);
console.log("Server started");

// connect to DB
connectDb(dbUrl)

// Routes
app.use("/api/auth", authRouter)
app.use("/api", userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/product", productRouter)
app.use("/api/order", orderRouter)

app.listen(port, (req, res) => {
    console.log(`Server listening on port ${port}`);
})