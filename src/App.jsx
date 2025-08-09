import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext.jsx';
import Sidebar from './Components/layout/Sidebar';
import Header from './Components/layout/Header';
import Dashboard from './Components/dashboard/dashboard';
import EmployeeManagement from './Components/employees/EmployeeManagement';
import DepartmentManagement from './Components/departments/DepartmentManagement';
import AttendanceTable from './Components/attendance/AttendanceTable';
import LeaveManagementView from './Components/leave/LeaveManagementView';
import PayrollTable from './Components/payroll/PayrollTable';
import JobsRecruitmentView from './Components/jops/JobList';
import PerformanceEvaluationView from './Components/performance/PerformanceTable';
import Setting from './Components/Settings/Setting';
import LandingPage from './Components/chart/chart';
import SignUp from './Auth/SignUp';
import Login from './Auth/Login';

// مكون لحماية الصفحات التي تتطلب تسجيل دخول
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/Login" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/Login" || location.pathname === "/SignUp";

  return (
    <div className="h-screen flex flex-col">
      {!hideLayout && <Header />}
      <div className={`flex ${!hideLayout ? 'flex-1' : ''} overflow-hidden`}>
        {!hideLayout && <Sidebar />}
        <div className="flex-1 overflow-auto p-4">
          <Routes>
            {/* المسارات العامة */}
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Login" element={<Login />} />

            {/* المسارات المحمية */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/employees" element={<PrivateRoute><EmployeeManagement /></PrivateRoute>} />
            <Route path="/departments" element={<PrivateRoute><DepartmentManagement /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><AttendanceTable /></PrivateRoute>} />
            <Route path="/leave-management" element={<PrivateRoute><LeaveManagementView /></PrivateRoute>} />
            <Route path="/payroll" element={<PrivateRoute><PayrollTable /></PrivateRoute>} />
            <Route path="/jobs" element={<PrivateRoute><JobsRecruitmentView /></PrivateRoute>} />
            <Route path="/performance" element={<PrivateRoute><PerformanceEvaluationView /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Setting /></PrivateRoute>} />
            <Route path="/chart" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
