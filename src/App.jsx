import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/landing/LandingPage';
import Onboarding from './pages/auth/Onboarding';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import JobListings from './pages/jobs/JobListings';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import KioskHome from './pages/kiosk/KioskHome';
import Wallet from './pages/wallet/Wallet';
import MicroLearning from './pages/learning/MicroLearning';
import LessonView from './pages/learning/LessonView';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/learning" element={<MicroLearning />} />
          <Route path="/learning/:moduleId" element={<LessonView />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/kiosk" element={<KioskHome />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
