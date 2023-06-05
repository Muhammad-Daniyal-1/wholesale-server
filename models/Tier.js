const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");
const TierSchema = new Schema({
    id: {
        type: Number,
    },
    tierName: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },

}, { timestamps: true });

TierSchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("Tier");
        doc.id = seq;
    }
    next();
});


const Tier = mongoose.model("Tier", TierSchema);
module.exports = Tier;

