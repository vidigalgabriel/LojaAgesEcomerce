const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Usuário já existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({ 
            name, 
            email, 
            password: hashedPassword 
        });

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, 'segredo_do_jwt', { expiresIn: 86400 });

        return res.send({ user, token });
    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user)
            return res.status(400).send({ error: 'Usuário não encontrado' });

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Senha inválida' });

        user.password = undefined;

        const token = jwt.sign({ id: user.id }, 'segredo_do_jwt', { expiresIn: 86400 });

        res.send({ user, token });
    } catch (err) {
        res.status(400).send({ error: 'Erro no login' });
    }
};