const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SubCategory = require('../models/SubCategory')

const addSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
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

    const categ = new SubCategory({
        name,
        slug,
        category,
        photo: photo
    });
    const createdCategory = await categ.save();
    const subCategoryList = await createdCategory.populate('category');
    res.status(201).json(subCategoryList);
}
);

const updateSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const subCategory = await SubCategory.findById(req.params.id);
    var url = req.protocol + '://' + req.get('host')
    if (req.file !== undefined) {
        var photo = url + '/uploads/images/' + req.file.filename;
    }

    if (subCategory) {
        subCategory.name = name;
        subCategory.slug = slugify(name, {
            lower: true
        });
        subCategory.category = category;
        if (req.file !== undefined) {
            subCategory.photo = photo;
        }
        const updatedSubCategory = await subCategory.save();
        const subCategoryList = await updatedSubCategory.populate('category');
        res.status(201).json(subCategoryList);
    } else {
        res.status(404);
        throw new Error('SubCategory not found');
    }
}
);

const deleteSubCategory = asyncHandler(async (req, res) => {
    const subCategory = await SubCategory.findById(req.params.id);
    if (subCategory) {
        const removedCat = await subCategory.deleteOne();
        res.json(removedCat);
    } else {
        res.status(404);
        throw new Error('SubCategory not found');
    }
}
);

const getSubCategory = asyncHandler(async (req, res) => {
    const subCategory = await SubCategory.find({}).populate('category');
    if (subCategory) {
        res.json(subCategory);
    } else {
        res.status(404);
        throw new Error('SubCategory not found');
    }
}
);


module.exports = { addSubCategory, updateSubCategory, deleteSubCategory, getSubCategory }