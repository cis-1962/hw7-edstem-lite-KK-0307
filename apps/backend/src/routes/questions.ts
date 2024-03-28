
import express, { Request, Response, NextFunction } from 'express';
import Question from '../models/question'; 
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

// Fetch all questions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
});

// Add a question
router.post('/add', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionText } = req.body;
    const author = req.session.userId;  // Assuming the session has the user's ID
    const newQuestion = new Question({ questionText, author });
    await newQuestion.save();
    res.status(201).send('Question added');
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
});

// Update an answer
router.post('/answer', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, answer } = req.body;
    const question = await Question.findByIdAndUpdate(_id, { answer }, { new: true });
    if (question) {
      res.status(200).send('Answer updated');
    } else {
      res.status(404).send('Question not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
    next(error);
  }
});

export default router;
