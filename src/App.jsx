import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Onboarding from './pages/auth/Onboarding';
import EmployerLogin from './pages/auth/EmployerLogin';
import EmployerRegister from './pages/auth/EmployerRegister';
import CandidateDashboard from './pages/dashboard/CandidateDashboard';
import JobListings from './pages/jobs/JobListings';
import CertificateUpload from './pages/jobs/CertificateUpload';
import Internships from './pages/internships/Internships';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJob from './pages/employer/PostJob';
import KioskHome from './pages/kiosk/KioskHome';
import Wallet from './pages/wallet/Wallet';
import MicroLearning from './pages/learning/MicroLearning';
import LessonView from './pages/learning/LessonView';
import InterviewBot from './pages/interview/InterviewBot';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/kiosk" element={<KioskHome />} />
          
          {/* Candidate Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding/*" element={<Onboarding />} />
          
          {/* Employer Auth Routes */}
          <Route path="/employer-login" element={<EmployerLogin />} />
          <Route path="/employer-register" element={<EmployerRegister />} />
          
          {/* Candidate Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/certificate-upload" element={
            <ProtectedRoute requiredRole="candidate">
              <CertificateUpload />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute requiredRole="candidate">
              <JobListings />
            </ProtectedRoute>
          } />
          <Route path="/internships" element={
            <ProtectedRoute requiredRole="candidate">
              <Internships />
            </ProtectedRoute>
          } />
          <Route path="/interview" element={
            <ProtectedRoute requiredRole="candidate">
              <InterviewBot />
            </ProtectedRoute>
          } />
          <Route path="/learning" element={
            <ProtectedRoute requiredRole="candidate">
              <MicroLearning />
            </ProtectedRoute>
          } />
          <Route path="/learning/:moduleId" element={
            <ProtectedRoute requiredRole="candidate">
              <LessonView />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute requiredRole="candidate">
              <Wallet />
            </ProtectedRoute>
          } />
          
          {/* Employer Protected Routes */}
          <Route path="/employer" element={
            <ProtectedRoute requiredRole="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/post-job" element={
            <ProtectedRoute requiredRole="employer">
              <PostJob />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
