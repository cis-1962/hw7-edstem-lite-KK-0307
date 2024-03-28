import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';  
import { SessionData } from 'express-session';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

// Hashing function for password
const hashPassword = async (password: string) => bcrypt.hash(password, 10);

// Signup route
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).send('Signup successful');
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
});

// Login route
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      (req.session as SessionData).userId = user._id;
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
});

// Logout route
router.post('/logout', requireAuth, (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).send('Error logging out');
      next(err);
    } else {
      res.status(200).send('Logout successful');
    }
  });
});

export default router;
