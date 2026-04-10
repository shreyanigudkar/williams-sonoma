"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err.message === 'Validation failed') {
        return res.status(400).json({ error: err.details || 'Validation failed' });
    }
    if (err.status === 400 || err.statusCode === 400) {
        return res.status(400).json({ error: err.message });
    }
    if (err.status === 404 || err.statusCode === 404) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
