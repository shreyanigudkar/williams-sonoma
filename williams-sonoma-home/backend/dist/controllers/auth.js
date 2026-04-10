"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const models_1 = require("../models");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const constants_1 = require("../utils/constants");
exports.authController = {
    async login(req, res) {
        try {
            const { email, password, role } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }
            const customer = await models_1.customerModel.findByEmail(email);
            if (!customer) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (customer.role !== role) {
                return res.status(400).json({ error: 'Invalid role for this user' });
            }
            const validPassword = await (0, password_1.comparePassword)(password, customer.password_hash);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = (0, jwt_1.generateToken)(customer.customer_id, customer.role);
            res.json({
                token,
                user: {
                    id: customer.customer_id,
                    email: customer.email,
                    name: customer.full_name,
                    role: customer.role,
                },
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Login failed' });
        }
    },
    async signup(req, res) {
        try {
            const { email, password, fullName, ageGroup, lifestyleTags, preferredStyles, preferredColors, lightingCondition, } = req.body;
            if (!email || !password || !fullName) {
                return res.status(400).json({ error: 'Email, password, and name required' });
            }
            const existing = await models_1.customerModel.findByEmail(email);
            if (existing) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            const passwordHash = await (0, password_1.hashPassword)(password);
            const customer = await models_1.customerModel.create({
                email,
                password_hash: passwordHash,
                full_name: fullName,
                age_group: ageGroup || 'unknown',
                lifestyle_tags: lifestyleTags || '',
                preferred_styles: preferredStyles || '',
                preferred_colors: preferredColors || '',
                lighting_condition: lightingCondition || 'neutral',
            });
            const token = (0, jwt_1.generateToken)(customer.customer_id, customer.role);
            res.status(201).json({
                token,
                user: {
                    id: customer.customer_id,
                    email: customer.email,
                    name: customer.full_name,
                    role: customer.role,
                },
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Signup failed' });
        }
    },
    async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const customer = await models_1.customerModel.findById(req.user.userId);
            res.json({
                id: customer.customer_id,
                email: customer.email,
                name: customer.full_name,
                role: customer.role,
                preferences: {
                    ageGroup: customer.age_group,
                    lifestyleTags: customer.lifestyle_tags,
                    preferredStyles: customer.preferred_styles,
                    preferredColors: customer.preferred_colors,
                    lightingCondition: customer.lighting_condition,
                },
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },
    async getPreferenceOptions(req, res) {
        try {
            res.json(constants_1.INTERFACE_PREFERENCES);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch preference options' });
        }
    },
};
