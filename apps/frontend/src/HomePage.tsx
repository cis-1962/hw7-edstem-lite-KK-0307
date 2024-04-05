import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

interface Question {
  id: string;
  questionText: string;
  author: string;
  answer?: string;
}

interface User {
  isLoggedIn: boolean;
  username?: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useSWR<User>('/api/account', fetcher);
  const { data: questions, error: questionsError, mutate } = useSWR<Question[]>('/api/questions', fetcher, { refreshInterval: 2000 });
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newAnswer, setNewAnswer] = useState<{ [key: string]: string }>({});

  const handleLogout = async () => {
    try {
      await axios.post('/account/logout');
      navigate('/login');
    } catch (error) {
      alert('Logout failed');
    }
  };

  const handleAddQuestion = async () => {
    try {
      await axios.post('/api/questions/add', { questionText: newQuestionText });
      setNewQuestionText('');
      mutate(); // Revalidate the SWR cache to update the questions list
    } catch (error) {
      alert('Failed to add question');
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    try {
      await axios.post('/api/questions/answer', { questionId, answer: newAnswer[questionId] });
      setNewAnswer(prev => ({ ...prev, [questionId]: '' }));
      mutate(); // Revalidate the SWR cache to update the questions list
    } catch (error) {
      alert('Failed to submit answer');
    }
  };

  if (questionsError) {
    return <div>Failed to load questions</div>;
  }

  if (!questions) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user?.isLoggedIn ? (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={handleLogout}>Logout</button>
          <div>
            <input type="text" value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} placeholder="Your question" />
            <button onClick={handleAddQuestion}>Add Question</button>
          </div>
          {questions.map(question => (
            <div key={question.id}>
              <p>{question.questionText} - Asked by {question.author}</p>
              <div>
                {question.answer ? <p>Answer: {question.answer}</p> : (
                  <div>
                    <input type="text" value={newAnswer[question.id] || ''} onChange={(e) => setNewAnswer({ ...newAnswer, [question.id]: e.target.value })} placeholder="Your answer" />
                    <button onClick={() => handleAnswerSubmit(question.id)}>Submit Answer</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          {questions.map(question => (
            <div key={question.id}>
              <p>{question.questionText} - Asked by {question.author}</p>
              <p>Answer: {question.answer || 'No answer yet'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
