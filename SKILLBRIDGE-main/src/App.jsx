import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthLanding from './pages/auth/AuthLanding';
import LandingPage from './pages/landing/LandingPage';
import Onboarding from './pages/auth/Onboarding';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import SkillGapDashboard from './pages/dashboard/SkillGapDashboard';
import JobListings from './pages/jobs/JobListings';
import JobRecommendation from './pages/jobs/JobRecommendation';
import JobMatching from './pages/jobs/JobMatching';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import KioskHome from './pages/kiosk/KioskHome';
import Wallet from './pages/wallet/Wallet';
import ProfileEditor from './components/ProfileEditor';
import OpportunitySearch from './components/OpportunitySearch';
import ResumeUpload from './pages/resume/ResumeUpload';
import ProfileSetup from './pages/profile/ProfileSetup';
import MicroLearning from './pages/learning/MicroLearning';
import LessonView from './pages/learning/LessonView';

function App() {
  const location = useLocation();
  
  // Hide navbar and footer on auth landing page
  const hideNavAndFooter = location.pathname === '/';

  return (
    <div className="app-container">
      {!hideNavAndFooter && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<AuthLanding />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/dashboard/skills" element={<SkillGapDashboard />} />
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/job-recommendations" element={<JobRecommendation />} />
          <Route path="/job-matching" element={<JobMatching />} />
          <Route path="/learning" element={<MicroLearning />} />
          <Route path="/learning/:moduleId" element={<LessonView />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/kiosk" element={<KioskHome />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile-editor" element={<div className="container mx-auto p-4"><ProfileEditor /></div>} />
          <Route path="/opportunities" element={<div className="container mx-auto p-4"><OpportunitySearch /></div>} />
          <Route path="/test" element={<div style={{padding: '20px', textAlign: 'center'}}><h1>Test Page Works!</h1><p>If you see this, routing is working.</p></div>} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default App;
