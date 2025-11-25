require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Order = require('./models/Order'); 
const User = require('./models/User');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

const NEW_BASE_URL = 'https://lojaages.onrender.com';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req, res, next) => {
    next();
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: 'Token ausente' });
    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).send({ error: 'Erro Token' });
    const [scheme, token] = parts;
    jwt.verify(token, 'segredo_do_jwt', (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};

app.post('/api/auth/login', require('./controllers/authController').login);
app.post('/api/auth/register', require('./controllers/authController').register);

app.post('/api/checkout', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        
        const total = items.reduce((acc, i) => acc + (i.price * i.quantity), 0);
        const order = await Order.create({
            user: req.userId,
            items,
            total,
            status: 'Aguardando Pagamento'
        });

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
            success_url: `${NEW_BASE_URL}/?success=true&orderId=${order._id.toString()}`,
            cancel_url: `${NEW_BASE_URL}/?canceled=true`,
        });

        return res.send({ ok: true, url: session.url, orderId: order._id });

    } catch (err) {
        return res.status(400).send({ error: 'Erro no pagamento' });
    }
});

app.post('/api/orders/confirm', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.body;
        await Order.findByIdAndUpdate(orderId, { status: 'Pagamento Aprovado' });
        res.send({ ok: true });
    } catch (err) {
        res.status(400).send({ error: 'Erro ao confirmar' });
    }
});

app.get('/api/my-orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.send(orders);
    } catch(e) { res.status(500).send({ error: 'Erro ao buscar' }); }
});

app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.send(orders);
    } catch(e) { res.status(500).send({ error: 'Erro admin' }); }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
        });
    })
    .catch(err => console.error('❌ Erro Banco:', err));