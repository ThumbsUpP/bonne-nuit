import { Request, Response, NextFunction } from 'express';
// Removed firebase auth for local testing

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Mock authentication for testing
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Using mock authentication: default-user');
    req.user = {
      uid: 'default-user',
      email: 'test@example.com',
    };
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // In a real scenario, we would verify the token here.
    // Since we're rolling back Firebase, we'll just use the token as a dummy UID if it's not a real one.
    req.user = {
      uid: idToken === 'mock-token' ? 'default-user' : idToken,
      email: 'test@example.com',
    };
    next();
  } catch (error) {
    console.error('Error in mock authentication:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
