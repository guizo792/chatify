import { Routes, Route } from 'react-router-dom';

import Navigation from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import LoginForm from './routes/authentication/login-form/login-form.component';
import SignUpForm from './routes/authentication/signup-form/signup-form.component';
import AboutUs from './routes/about-us/about-us.component';
import Chat from './routes/chat/chat.component';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="/auth/login/*" element={<LoginForm />} />
        <Route path="/auth/signup/*" element={<SignUpForm />} />
        <Route path="/chat/*" element={<Chat />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Route>
    </Routes>
  );
}

export default App;
