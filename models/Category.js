const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");

const CategorySchema = new Schema({
    id : {
        type: Number,
    },
    name: {
        type: String,
        // required: true
        default: 'Uncategorized'
    },
    slug: {
        type: String,
        // required: true
    },
    photo: {
        type: String,
        // required: true
    }
}, {
    timestamps: true
});


// CategorySchema.pre(
//     "save",
//     async function (next) {
//         const category = this;
//         category.slug = slugify(category.name, {
//             lower: true
//         });
//         next();
//     }
// )

CategorySchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("Category");
        doc.id = seq;
    }
    next();
});





const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;