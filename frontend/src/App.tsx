import { Routes, Route } from 'react-router-dom';

import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import LoginForm from './routes/authentication/login-form/login-form.component';
import SignUpForm from './routes/authentication/signup-form/signup-form.component';
import AboutUs from './routes/about-us/about-us.component';
import Chat from './routes/chat/chat.component';
import ProtectedRoute from './components/protectedRoute/protectedRoute.component';
import PageNotFound from './routes/page-not-found/page-not-found.component';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="/auth/login/*" element={<LoginForm />} />
        <Route path="/auth/signup/*" element={<SignUpForm />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route
          path="/chat/*"
          element={
            <ProtectedRoute accessBy="authenticated">
              <Chat />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
