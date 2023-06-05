const { default: mongoose } = require("mongoose")
const { Schema } = mongoose;
const getNextSequenceValue = require("../middleware/counter");

const OrderSchema = new Schema({
    id : {
        type: Number,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        }
    ],
    shippingInfo: {
        name : { type: String },
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    billingInfo: {
        name : { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },

    orderNote: {
        type: String
    },

    paymentMethod: {
        type: String,
        required: true
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }

}, {
    timestamps: true
});

OrderSchema.pre("save", async function (next) {
    const doc = this;
    if (doc.id == null) {
        const seq = await getNextSequenceValue("Order");
        doc.id = seq;
    }
    next();
});


const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;