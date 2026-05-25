import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GenerateID from './pages/GenerateID';
import Receipt from './pages/Receipt';
import Certificate from './pages/Certificate';
import CertificateTypes from './pages/CertificateTypes';
// import Profile from './pages/Profile';
import ContactSupport from './pages/ContactSupport';
import Legal from './pages/Legal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate-id" element={<GenerateID />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/certificate" element={<CertificateTypes />} />
        <Route path="/certificate/:type" element={<Certificate />} />
        <Route path="/terms" element={<Legal />} />
        <Route path="/privacy" element={<Legal />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}
