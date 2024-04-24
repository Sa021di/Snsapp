import React, { useContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import BotNavbar from './components/navbar/BotNavbar';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import BookmarksPage from './pages/bookmarks/BookmarksPage';
import './style.scss';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
function App() {
  const { currentUser } = useContext(AuthContext);

  const Layout = () => {
    return (
      <div className={`theme-light`}>
        <Navbar />
        <BotNavbar />
        <Outlet />
      </div>
    );    
  };
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true, // "index" 
          element: <Home />,
        },
        {
          path: '/profile/:id',
          element: <Profile />,
        },
        {
          path: '/bookmarks',
          element: <BookmarksPage />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;