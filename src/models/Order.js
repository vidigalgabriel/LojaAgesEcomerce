const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            productId: Number,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: Number,
    status: {
        type: String,
        default: 'Pendente'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', OrderSchema);