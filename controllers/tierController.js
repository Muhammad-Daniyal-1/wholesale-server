const asyncHandler = require('express-async-handler');
const Tier = require('../models/Tier');

const createTier = asyncHandler(async (req, res) => {
    const { tierName, percentage } = req.body;

    const tier = new Tier({
        tierName,
        percentage
    });
    const createdTier = await tier.save();
    res.status(201).json(createdTier);
}
);

const updateTier = asyncHandler(async (req, res) => {
    const { tierName, percentage } = req.body;
    const tier = await Tier.findById(req.params.id);

    if (tier) {
        tier.tierName = tierName;
        tier.percentage = percentage;
        const updatedTier = await tier.save();
        res.status(201).json(updatedTier);
    }
    else {
        res.status(404);
        throw new Error('Tier not found');
    }
}
);


const deleteTier = asyncHandler(async (req, res) => {
    const tier = await Tier.findById(req.params.id);
    if (tier) {
        const removedTier = await tier.deleteOne();
        res.json(removedTier);
    }
    else {
        res.status(404);
        throw new Error('Tier not found');
    }
}
);

const getTiers = asyncHandler(async (req, res) => {
    const tiers = await Tier.find({});
    res.json(tiers);
}
);

module.exports = { createTier, updateTier, deleteTier, getTiers };