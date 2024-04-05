import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import SignUp from './SignUp'; 
import Login from './Login';
import HomePage from './HomePage';


const router = createHashRouter([
  { path: '/', element: <HomePage /> },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <Login />},
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
