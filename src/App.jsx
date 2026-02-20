import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthLanding from './pages/auth/AuthLanding';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import Onboarding from './pages/auth/Onboarding';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import SkillGapDashboard from './pages/dashboard/SkillGapDashboard';
import JobListings from './pages/jobs/JobListings';
import JobRecommendation from './pages/jobs/JobRecommendation';
import JobMatching from './pages/jobs/JobMatching';
import CertificateUpload from './pages/jobs/CertificateUpload';
import Internships from './pages/internships/Internships';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import KioskHome from './pages/kiosk/KioskHome';
import Wallet from './pages/wallet/Wallet';
import ProfileEditor from './components/ProfileEditor';
import OpportunitySearch from './components/OpportunitySearch';
import ResumeUpload from './pages/resume/ResumeUpload';
import ProfileSetup from './pages/profile/ProfileSetup';
import MicroLearning from './pages/learning/MicroLearning';
import LessonView from './pages/learning/LessonView';
import StaggeredMenu from './components/layout/StaggeredMenu';
import ThemeToggle from './components/layout/ThemeToggle';
import LanguageToggle from './components/layout/LanguageToggle';
import SiteFooter from './components/layout/Footer';
import InterviewBot from './pages/interview/InterviewBot';
import { useAuth } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isCandidateLoggedIn = user.isAuthenticated && user.role === 'candidate';

  // Hide navbar and footer on auth landing page
  const hideNavAndFooter = location.pathname === '/auth';

  return (
    <div className="app-container">
      {!hideNavAndFooter && <StaggeredMenu />}
      <LanguageToggle />
      <ThemeToggle />
      <main>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLanding />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding/*" element={<Onboarding />} />

          {/* Profile & Resume Routes */}
          <Route path="/resume" element={<ResumeUpload />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/profile-editor" element={<div className="container mx-auto p-4"><ProfileEditor /></div>} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/dashboard/skills" element={<SkillGapDashboard />} />
          <Route path="/skillgap" element={<SkillGapDashboard />} />

          {/* Jobs Routes */}
          <Route path="/jobs" element={<JobListings />} />
          <Route path="/job-recommendations" element={<JobRecommendation />} />
          <Route path="/job-matching" element={<JobMatching />} />
          <Route path="/certificate-upload" element={<CertificateUpload />} />

          {/* Other Routes */}
          <Route path="/internships" element={<Internships />} />
          <Route path="/interview" element={<InterviewBot />} />
          <Route path="/learning" element={<MicroLearning />} />
          <Route path="/learning/:moduleId" element={<LessonView />} />
          <Route path="/opportunities" element={<div className="container mx-auto p-4"><OpportunitySearch /></div>} />

          {/* Employer & System Routes */}
          <Route
            path="/employer"
            element={isCandidateLoggedIn ? <Navigate to="/dashboard" replace /> : <EmployerDashboard />}
          />
          <Route path="/kiosk" element={<KioskHome />} />
          <Route path="/wallet" element={<Wallet />} />

          {/* Test Route */}
          <Route path="/test" element={<div style={{ padding: '20px', textAlign: 'center' }}><h1>Test Page Works!</h1><p>If you see this, routing is working.</p></div>} />
        </Routes>
      </main>
      {!hideNavAndFooter && <SiteFooter />}
    </div>
  );
}

export default App;
