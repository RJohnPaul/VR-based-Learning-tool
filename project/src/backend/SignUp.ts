const bcrypt = require('bcryptjs');
const express = require('express');
// const { Request, Response } = require('express');
const User = require('./models/UserSchema');

const router = express.Router();

router.post('/signup', async (req: { body: { firstName: any; lastName: any; email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; message?: string; }): void; new(): any; }; }; }) => {
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

module.exports = router;