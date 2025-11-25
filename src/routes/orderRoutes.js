const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: 'Token não informado' });

    const parts = authHeader.split(' ');
    if (!parts.length === 2) return res.status(401).send({ error: 'Erro no formato do Token' });

    const [scheme, token] = parts;

    jwt.verify(token, 'segredo_do_jwt', (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token inválido/expirado' });
        req.userId = decoded.id;
        next();
    });
};

router.post('/checkout', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).send({ error: 'Erro de configuração no servidor (Stripe Key)' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'brl',
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: 'http://localhost:3000?success=true',
            cancel_url: 'http://localhost:3000?canceled=true',
        });

        const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        const order = await Order.create({
            user: req.userId,
            items,
            total,
            status: 'Aguardando Pagamento'
        });

        return res.send({ ok: true, url: session.url, orderId: order._id });

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao processar pagamento: ' + err.message });
    }
});

router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.send(orders);
    } catch (e) { res.status(500).send({ error: 'Erro ao buscar pedidos' }); }
});

router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.send(orders);
    } catch (e) { res.status(500).send({ error: 'Erro admin' }); }
});

module.exports = router;