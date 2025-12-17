const errorHandler = (err, req, res, next) => {
    // Log detailed error for debugging
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        console.error("Sequelize Validation Error Details:", JSON.stringify(err.errors, null, 2));
    } else {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Server Error';

    // enhance response with validation details if available
    const response = {
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    };

    if (err.errors) {
        response.errors = err.errors.map(e => ({ field: e.path, message: e.message, type: e.type }));
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
