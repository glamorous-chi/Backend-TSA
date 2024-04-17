// create an endpoint to get all users, get one user, update user, and delete user
import User from "../models/user.js"
import { cloudinary } from "../helpers/cloudinary.config.js"
import { hashedPassword } from "../helpers/auth.js"

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        res.json({ success: true, message: "Users retrieved successfully", users })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Creating a function to get a user
// get by id or get it using our middelware
export const getOneUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        res.json({ success: true, message: "User retrieved successfully", user })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Creating a function to update a user
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.user._id
        const { name, email, password, street, city, state, zip } = req.body;
        const image = req.file

        const user = await User.findById({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        // Updating the users
        const updateUserData = {
            name: name || user.name,
            address: {
                street: street || user.address.street,
                city: city || user.address.city,
                state: state || user.address.state,
                zip: zip || user.address.zip
            }
        };

        if (imageFile) {
            // Delete image from cloudinary
            if (user.image && user.imagePublicId) {
                await cloudinary.uploader.destroy(user.imagePublicId);
            }
            // upload new image to cloudinaryu
            const imageResult = await cloudinary.uploader.upload(imageFile.path);
            updateUserData.image = imageResult.secure_url;
            updateUserData.imagePublicId = imageResult.public_id;
        }

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(_id, updateUserData, {
            new: true,
        });

        return res.json({
            success: true,
            message: "User Profile updated successfully",
            updatedUser,
        });
    }
    // Save the updated product
    // const updatedUser = await user.save();
    // res.json({ success: true, message: "User updated successfully", updatedUser,}).select("-password")
    catch (err) {
        res.status(500).json({ success: false, message: "Failed to update user profile", error: err });
    }
}
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if product exists
        const user = await User.deleteOne({ _id: userId })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }
        return res.json({ success: true, message: "User deleted successfully" })
    }

    catch (err) {
        console.log("Error deleting user", err.message);
        return res.status(500).json({ message: "User deletion failed", err })
    }
}

export const updateUserRole = async (req, res) => {
    try {
      const { _id } = req.user;
      const { role } = req.body;
  
      console.log("Role is: ", role);

      const updateQuery = {
        role: role,
        isAdmin: role === 1 ? true : false,
      };
  
      const updatedUser = await User.findByIdAndUpdate(_id, updateQuery, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      updatedUser.password = undefined;
      res.json({ message: "User role updated successfully", user: updatedUser });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Failed to update user role", errorMsg: err.message });
    }
  };
