module.exports = (req, res, next) => {
    if (req.admin && req.admin.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
