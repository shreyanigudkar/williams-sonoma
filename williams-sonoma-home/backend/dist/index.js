"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_1 = require("./middleware/error");
const dotenv_1 = __importDefault(require("dotenv"));
const migrations_1 = __importDefault(require("./config/migrations"));
const seedData_1 = require("./config/seedData");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Initialize database with migrations and seed data
const initDatabase = async () => {
    try {
        await (0, migrations_1.default)();
        await (0, seedData_1.seedDatabase)();
    }
    catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
};
initDatabase();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api', routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handler
app.use(error_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`✨ Williams Sonoma Home Backend running on port ${PORT}`);
});
exports.default = app;
