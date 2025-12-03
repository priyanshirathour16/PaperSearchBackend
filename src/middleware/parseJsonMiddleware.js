const parseJsonFields = (req, res, next) => {
    if (req.body.editorial_board) {
        try {
            if (typeof req.body.editorial_board === 'string') {
                req.body.editorial_board = JSON.parse(req.body.editorial_board);
            }
        } catch (error) {
            return res.status(400).json({ message: 'Invalid JSON format for editorial_board' });
        }
    }

    if (req.body.areas_covered) {
        try {
            if (typeof req.body.areas_covered === 'string') {
                req.body.areas_covered = JSON.parse(req.body.areas_covered);
            }
        } catch (error) {
            return res.status(400).json({ message: 'Invalid JSON format for areas_covered' });
        }
    }

    next();
};

module.exports = parseJsonFields;
