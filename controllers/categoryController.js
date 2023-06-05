const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const slugify = require('slugify');

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    var url = req.protocol + '://' + req.get('host')
    if (req.file !== undefined) {
        var photo = url + '/uploads/images/' + req.file.filename;
    }
    else {
        var photo = url + '/uploads/images/placeholder.png'
    }

    const slug = slugify(name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g
    });

    const category = new Category({
        name: name,
        slug: slug,
        photo: photo
    });
    const createdCategory = await category.save();
    res.status(201).json({ message: 'Category created successfully', createdCategory });
}
);

const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    var url = req.protocol + '://' + req.get('host')
    if (req.file !== undefined) {
        var photo = url + '/uploads/images/' + req.file.filename;
    }

    if (category) {
        category.name = name;
        category.slug = slugify(name, {
            lower: true
        });
        if (req.file !== undefined) {
            category.photo = photo;
        } 
        const updatedCategory = await category.save();
        res.status(201).json(updatedCategory);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
}
);


const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        const removedCat = await category.deleteOne();
        res.json(removedCat);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});


const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
}
);


const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        res.json(category);
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
}
);

module.exports = { createCategory, updateCategory, deleteCategory, getAllCategories, getCategoryById };
