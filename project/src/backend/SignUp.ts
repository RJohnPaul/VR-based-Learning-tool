import bcrypt from 'bcryptjs';
import express, { Request, Response } from 'express';
import User from './models/UserSchema';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, email, password } = req.body;

    try {
        console.log('Received signup request:', req.body);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Account already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
        
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
