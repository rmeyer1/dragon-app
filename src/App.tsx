import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import SignalDeckPage from './pages/SignalDeckPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="profile" element={<SignalDeckPage />} />
          <Route path="vcard" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
