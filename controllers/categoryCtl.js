const Categories = require("../models/categoryModel");

const categoryCtl = {
    getCategories: async (req, res) => {
       try {
           const categories = await Categories.find();
            res.json(categories);
       } catch (error) {
           return res.status(500).send(error.message);
       }
    },
    createCategory: async (req, res, next) => {
        try {
            // if a user has a role =1 ---> admin
            // only admin can create, delete and update category
            const { userName } = req.body;
            const category = await Categories.findOne({userName});
            if (category) return res.status(400).json({ msg: "This category already present" })

            const newCategory = new Categories({ userName });

            if (newCategory._id) return res.json({ msg: "It is the same object" })

            // if (newCategory._id === null) return await newCategory.save();
            // res.json({ msg: 'A category has been created' })


            await newCategory.save();
            res.json({ msg: 'A category has been created' })
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    deleteCategory: async (req,res) => {
        try {
            await Categories.findByIdAndDelete(req.params.id)
            res.json({msg:"Delete a category"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
     updateCategory: async (req,res) => {
         try {
             const { userName } = req.body;
             await Categories.findOneAndUpdate({ _id: req.params.id }, { userName })

             res.json({ msg: "A category has been updated" })
     } catch (error) {
         return res.status(500).json({msg:error.message})
     }
 }
}
module.exports = categoryCtl;