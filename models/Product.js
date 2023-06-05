const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");

const ProductSchema = new Schema({
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
    reference: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
    },
    skuNumber: {
        type: String,
        required: true
    },
    images: {
        type: Array,
    },
    specificReferences:{
        type: Array,
    },
    condition: {
        type: String,
    },
    variation: {
        type: Array,
    },
    metalType: {
        type: String,
        enum : ['Diamond' , 'Gold', 'Silver', 'Moissanite']
    },
    visibility: {
        type: Boolean,
        default: true
    },
    tags: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    styleCode: {
        type: String,
    },
    barCode: {
        type: String,
    },
    metalColor: {
        type: String,
    },
    rhodiumPlayed: {
        type: String,
    },
    chainLength: {
        type: String,
    },
    chainType: {
        type: String,
    },
    clasp: {
        type: String,
    },
    ringSize: {
        type: String,
    },
    pheight: {
        type: String,
    },
    pwidth: {
        type: String,
    },
    plength: {
        type: String,
    },
    backing: {
        type: String,
    },
    minCartTotalWeight: {
        type: String,
    },
    averageColor: {
        type: String,
    },
    averageClarity: {
        type: String,
    },
    settingType: {
        type: String,
    },
    numberofDiamonds: {
        type: String,
    }
}, {
    timestamps: true
});

ProductSchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("Product");
        doc.id = seq;
    }
    next();
});


const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;