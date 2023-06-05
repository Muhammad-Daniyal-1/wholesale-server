const asyncHandler = require('express-async-handler');
const Tag = require('../models/Tag');

const createTag = asyncHandler(async (req, res) => {
    const { tagName, retailerValue, dropshipperValue } = req.body;

    const tag = new Tag({
        tagName,
        retailerValue,
        dropshipperValue
    });
    const createdTag = await tag.save();
    res.status(201).json(createdTag);
}
);

const updateTag = asyncHandler(async (req, res) => {
    const { tagName, retailerValue, dropshipperValue } = req.body;
    const tag = await Tag.findById(req.params.id);

    if (tag) {
        tag.tagName = tagName;
        tag.retailerValue = retailerValue;
        tag.dropshipperValue =dropshipperValue;
        const updatedTag = await tag.save();
        res.status(201).json(updatedTag);
    }
    else {
        res.status(404);
        throw new Error('Tag not found');
    }
}
);


const deleteTag = asyncHandler(async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    if (tag) {
        const removedTag = await tag.deleteOne();
        res.json(removedTag);
    }
    else {
        res.status(404);
        throw new Error('Tag not found');
    }
}
);

const getTag = asyncHandler(async (req, res) => {
    const tags = await Tag.find({});
    res.json(tags);
}
);

module.exports = { createTag, updateTag, deleteTag, getTag };