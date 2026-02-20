import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/landing/LandingPage';
import Onboarding from './pages/auth/Onboarding';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import JobListings from './pages/jobs/JobListings';
import CertificateUpload from './pages/jobs/CertificateUpload';
import Internships from './pages/internships/Internships';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import KioskHome from './pages/kiosk/KioskHome';
import Wallet from './pages/wallet/Wallet';
import MicroLearning from './pages/learning/MicroLearning';
import LessonView from './pages/learning/LessonView';
import InterviewBot from './pages/interview/InterviewBot';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/certificate-upload" element={<CertificateUpload />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/interview" element={<InterviewBot />} />
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
