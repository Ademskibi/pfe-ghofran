import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/Dashboard';
import ClassOverview from './pages/ClassOverview';
import StudentDetail from './pages/StudentDetail';
import ProgressTracking from './pages/ProgressTracking';
import StudentPortal from './pages/StudentPortal';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route element={<Layout />}>
             {/* Teacher Routes */}
             <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['teacher']}><Dashboard /></ProtectedRoute>
             } />
             <Route path="/class-overview" element={
                <ProtectedRoute allowedRoles={['teacher']}><ClassOverview /></ProtectedRoute>
             } />
             <Route path="/student/:id" element={
                <ProtectedRoute allowedRoles={['teacher']}><StudentDetail /></ProtectedRoute>
             } />
             <Route path="/progress-tracking" element={
                <ProtectedRoute allowedRoles={['teacher']}><ProgressTracking /></ProtectedRoute>
             } />

             {/* Student Route */}
             <Route path="/student-portal" element={
                <ProtectedRoute allowedRoles={['student']}><StudentPortal /></ProtectedRoute>
             } />
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
