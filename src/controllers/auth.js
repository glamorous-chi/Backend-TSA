import User from "../models/user.js"
import { hashedPassword, comparePassword} from "../helpers/auth.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
// Cloudinary below will be used to upload our image
import { cloudinary } from "../helpers/cloudinary.config.js";

dotenv.config();

// Creating registration function
export const signUp = async (req, res) => {
    try {
        // handle request fields using (req.body)
        const { name, email, password } = req.body

        const image = req.file
        // Field Validation
        if (!name) {
            return res.status(400).json({ success: false, message: "Name required" })
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Emailrequired" })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Passowrd required" })
        }


        // Check if email exists already or is taken
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" })
        }

        // Hash Password - It was moved to the helpers folder under auth.js
        const hashed = await hashedPassword(password)


        // creating a new user object
        const user = new User({
            name,
            email,
            password: hashed,
        })

        // handling  image upload
        if (image) {
            try {
                const imagePath = await cloudinary.uploader.upload(image.path);
                user.image = imagePath.secure_url;
                user.imagePublicId = imagePath.public_id;
            }
            catch (err) {
                console.log(err);
                return res.json({ success: false, message: "Error uploading image", err });
            }
        }
        // saving the new user and the image to the database
        await user.save()

        // create token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return res.json({ success: true, user, token })
    }

    catch (err) {
        console.log("Error creating registration", err.message);
        return res.status(500).json({ message: "Registration failed", err })
    }
}

export const login = async (req, res) => {
    try {
        // handle request fields using (req.body)
        const { email, password } = req.body

        // Field Validation
        if (!email) {
            return res.status(400).json({ success: false, message: "Emailrequired" })
        }
        if (!password) {
            return res.status(400).json({ success: false, message: "Passowrd required" })
        }

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 })
        // Checking the Password
        const match = await comparePassword(password, user.password)

        if (!match) {
            return res.status(400).json({ success: false, message: "Wrong password" })
        }
        return res.json({ success: true, message: "Login successful", user, token })
    }
    catch (err) {
        console.log("Error creating registration", err.message);
        return res.status(500).json({ message: "Registration failed", err })
    }
}

export const forgotPassword = async(req, res) => {
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).json({ success: false, message: "Email required" })
        }
        // find user using email
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        // Generate OTP an dsend to the user

        // If user is found, generate a password reset token
        const resetToken = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        // Send email to the user with the reset token
        const domain = "www.chioma.com";
        const resetLink = `${domain}/reset/${resetToken}`;

        // Send email to the user with the reset token
        // const mailOptions = {
        //     from: process.env.EMAIL_FROM,
        //     to: user.email,
        //     subject: "Password Reset",
        //     text: `Hello ${user.name},\n\nTo reset your password, visit the following link:\n\n${resetLink}\n\nIf you did not make this request, please ignore this email and your password will remain unchanged.\n\nSincerely,\n${process.env.EMAIL_FROM}`
        // };

        // Send the reset token with the response
        return res.json({ success: true, message: "Password reset token generated successfully", resetToken })

    } 
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to create reset token"})
    }
}
export const resetPassword = async(req, res) => {
    try {
        const {newPassword} = req.body;

        const resetToken = req.headers.authorization
        if(!newPassword) {
            return res.status(400).json({ success: false, message: "New password required" })
        }
        if(!resetToken || !resetToken.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: "Invalid token or no reset token provided" })
        }

        // Get token without the Bearer
        const token = resetToken.split(" ")[1];

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            if(!decodedToken){
                return res.status(403).json({ success: false, message: "Invalid or expired token provided" })
            }
            const userId = decodedToken.userId
            // find the user by userId
            const user = await User.findById(userId)

            if(!user) {
                return res.status(404).json({ success: false, message: "User not found" })
            }
            const hashedPwd = await hashedPassword(newPassword)

            // Update the old password with the new password
            user.password = hashedPwd;

            await user.save()

            return res.json({ success: true, message: "Password reset successfully" })
    } 
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to reset password"})
    }
}