const { validationResult } = require('express-validator');
const authService = require('../services/AuthService');

exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const { token, role } = await authService.login(email, password);

        res.json({ token, role, message: 'Login successful' });
    } catch (error) {
        console.log("error", error)
        if (error.message === 'Invalid credentials') {
            return res.status(401).json({ message: error.message });
        }
        next(error);
    }
};
