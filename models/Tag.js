const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");
const TagSchema = new Schema({
    id: {
        type: Number,
    },
    tagName: {
        type: String,
        required: true
    },
    retailerValue: {
        type: Number,
        required: true
    },
    dropshipperValue: {
        type: Number,
        required: true
    }

}, { timestamps: true });

TagSchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("Tag");
        doc.id = seq;
    }
    next();
});


const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;

