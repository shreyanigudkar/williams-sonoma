import { Request, Response } from 'express';
import { customerModel, manufacturerModel } from '../models';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken, verifyToken } from '../utils/jwt';
import { INTERFACE_PREFERENCES } from '../utils/constants';

export const authController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const user = role === 'manufacturer' 
        ? await manufacturerModel.findByEmail(email)
        : await customerModel.findByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.role !== role) {
        return res.status(400).json({ error: 'Invalid role for this user' });
      }

      const validPassword = await comparePassword(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const userId = role === 'manufacturer' ? user.manufacturer_id : user.customer_id;
      const token = generateToken(userId, user.role);

      res.json({
        token,
        user: {
          id: userId,
          email: user.email,
          name: user.full_name,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async signup(req: Request, res: Response) {
    try {
      const {
        email,
        password,
        fullName,
        role,
        // Customer-only fields
        ageGroup,
        lifestyleTags,
        preferredStyles,
        preferredColors,
        lightingCondition,
      } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and name required' });
      }

      const existing = role === 'manufacturer'
        ? await manufacturerModel.findByEmail(email)
        : await customerModel.findByEmail(email);

      if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const passwordHash = await hashPassword(password);

      let user;
      let userId;

      if (role === 'manufacturer') {
        user = await manufacturerModel.create({
          email,
          password_hash: passwordHash,
          full_name: fullName,
          manufacturerId: req.body.manufacturerId
        });
        userId = user.manufacturer_id;
      } else {
        user = await customerModel.create({
          email,
          password_hash: passwordHash,
          full_name: fullName,
          age_group: ageGroup || 'unknown',
          lifestyle_tags: lifestyleTags || '',
          preferred_styles: preferredStyles || '',
          preferred_colors: preferredColors || '',
          lighting_condition: lightingCondition || 'neutral',
        });
        userId = user.customer_id;
      }

      const token = generateToken(userId, user.role);

      res.status(201).json({
        token,
        user: {
          id: userId,
          email: user.email,
          name: user.full_name,
          role: user.role,
          manufacturerId: user.external_manufacturer_id
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Signup failed' });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = req.user.role === 'manufacturer'
        ? await manufacturerModel.findById(req.user.userId)
        : await customerModel.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = req.user.role === 'manufacturer' ? user.manufacturer_id : user.customer_id;

      res.json({
        id: userId,
        email: user.email,
        name: user.full_name,
        role: user.role,
        manufacturerId: user.external_manufacturer_id || null,
        preferences: req.user.role === 'manufacturer' ? null : {
          ageGroup: user.age_group,
          lifestyleTags: user.lifestyle_tags,
          preferredStyles: user.preferred_styles,
          preferredColors: user.preferred_colors,
          lightingCondition: user.lighting_condition,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  async getPreferenceOptions(req: Request, res: Response) {
    try {
      res.json(INTERFACE_PREFERENCES);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch preference options' });
    }
  },
};
