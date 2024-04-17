import Category from "../models/category.js";
import slugify from "slugify"

export const createCategory = async (req, res) =>{
    try{
    const {name} = req.body
        if(!name){
            return res.status(400).json("Name is required")
        }

        const existingCategory = await Category.findOne({name})
        if(existingCategory){
            return res.status(400).json({success: false, message: "Category already exists"})
        }

        const category = await new Category({name, slug: slugify(name)}).save()
        // category.save()
        res.status(201).json({success: true, message: "Category created successfully", category})
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Error creating category"})
    }
}

// create an endpoint to get all categories, get one category, update category, and delete category

export const getAllCategories = async (req, res) => {
    try{
        const category = await Category.find()
        res.json({success: true, message: "Categories retrieved successfully", category})
    }
    catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}
// Creating a function to get a user
export const getOneCategory = async (req, res) => {
    try{
        const {categoryId} = req.params;

        const category = await Category.findById(categoryId)
        if(!category){
           return res.status(404).json({success: false, message: "Category not found"})
        }
       res.json({success: true, message:"Category retrieved successfully", category})
    }
    catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

// Creating a function to update a user
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const {name, slug} = req.body;

        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }
        if(name){
            const slugName = slugify(name)
            category.slug = slugify(name) || category.slug
        }
        // Updating the users
        category.name = name || user.name;

        // Save the updated product
        const updatedCategory = await category.save();
        res.json({ success: true, message: "User updated successfully", category })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
       
        // Check if product exists
        const category = await Category.deleteOne(categoryId)
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }
        return res.json({ success: true, message:"Category deleted successfully" })
    }

    catch (err) {
        console.log("Error deleting category", err.message);
        return res.status(500).json({ message: "Category deletion failed", err })
    }
}
