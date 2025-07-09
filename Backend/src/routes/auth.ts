import express, { Request, Response } from 'express';
import { signin, signup } from '../controllers/auth_controller';
import { authMiddleware } from '../middlewares/authMiddleware';


const authrouter = express.Router();
authrouter.post('/signup', async (req: Request, res: Response) => {
  try {
	await signup(req, res);
  } catch (error) {
	res.status(500).json({ error: 'An error occurred during sign up' });
  }
});
authrouter.post('/signin', async (req: Request, res: Response) => {
  try {
  await signin(req, res);
  } catch (error) {
  res.status(500).json({ error: 'An error occurred during sign in',});
  }
});
authrouter.get('/profile', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ 
    message: 'User profile',
    user: (req as any).user
  });
});

export default authrouter;
