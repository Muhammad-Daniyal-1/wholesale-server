const asyncHandler = require("express-async-handler");
const stripe = require("stripe")('sk_test_51KiIuMEJhTgsz6Az1FXv4vzxQosGyQrWs1oNsIqmbOXmy02hpONOMVLfSi4ZRhssXH5KeLIOegh3kqN4PtR9WtLq00F8WX8EfW');
const { v4: uuidv4 } = require("uuid");

const cardPayment = asyncHandler(async (req, res) => {
    const { number, exp_month, exp_year, cvc, amount , email } = req.body;
    const intPrice = parseInt(amount * 100);
    const idempotencyKey = uuidv4();
    const token = await stripe.tokens.create({
        card: {
            number: number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc,
        }
    }
    );
    try {
        const customer = await stripe.customers.create({
            email: email,
            source: token.id
        });
        const charge = await stripe.charges.create(
            {
                amount: intPrice,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: "Charged for purchase of order Id = this"
            },
            {
                idempotencyKey
            }
        );
        res.status(200).json({ message: "Payment Successful", "charge": charge });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error : error });
    }
});


module.exports = { cardPayment };
