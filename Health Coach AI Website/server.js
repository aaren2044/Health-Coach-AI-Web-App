import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debugging: Check if environment variables are correctly loaded
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY);

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Additional server-side validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const { data: existingUserEmail, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);

    const { data: existingUserUsername, error: usernameError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username);

    if (emailError || usernameError) {
      return res.status(400).json({ message: 'Error checking user existence' });
    }

    if (existingUserEmail.length > 0) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (existingUserUsername.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password with salt rounds
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user data into Supabase (PostgreSQL table)
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, username, password: hashedPassword }])
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create JWT token for the user
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return response with user and JWT token
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        email: user.email,
        username: user.username,
      },
    });

  } catch (error) {
    console.error('❌ Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Other routes (Login, etc.) remain unchanged...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
