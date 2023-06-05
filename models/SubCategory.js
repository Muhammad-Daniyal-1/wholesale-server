const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");

const SubCategorySchema = new Schema({
    id : {
        type: Number,
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }
}, {
    timestamps: true
});

SubCategorySchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("SubCategory");
        doc.id = seq;
    }
    next();
});





const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = SubCategory;