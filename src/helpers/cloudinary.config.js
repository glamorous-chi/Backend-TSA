import dotenv from "dotenv"
// The import below is an alias import
import {v2 as cloudinary} from "cloudinary"

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export {cloudinary}

