import { Routes, Route } from 'react-router-dom';

import Navigation from './routes/navigation/navigation.component';
import JoinForm from './components/join-form/join-form.component';
import Chat from './components/chat/chat.component';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        {/* <Route index element={<Home />} /> */}
        <Route index element={<JoinForm />} />
        <Route path="/chat/*" element={<Chat />} />
        {/* <Route path="/auth" element={<Authentication />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
