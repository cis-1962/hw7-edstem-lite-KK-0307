import { Request, Response, NextFunction } from 'express';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    next(new Error('Unauthorized')); // User is not authenticated, pass an error to the error handling middleware
  }
};

export default requireAuth;
