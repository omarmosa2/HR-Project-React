import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => api.post('/login', { email, password });
export const logout = () => api.post('/logout');

// Departments
export const getDepartments = () => api.get('/departments');
export const getDepartment = (id) => api.get(`/departments/${id}`);
export const createDepartment = (data) => api.post('/departments', data);
export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

// Employees
export const getEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const createEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Dashboard Statistics
// ...existing code...
export const getAttendanceStats = () => api.get('/dashboard/attendance-stats');
export const getPayrollStats = () => api.get('/dashboard/payroll-stats');
export const getLeaveStats = () => api.get('/dashboard/leave-stats');
export const getRecentActivities = () => api.get('/dashboard/recent-activities');
export const getWeeklyAttendance = () => api.get('/dashboard/weekly-attendance');
export const getMonthlyData = () => api.get('/dashboard/monthly-data');
export const getDepartmentStats = () => api.get('/dashboard/department-stats');

// Attendance
export const getAttendances = () => api.get('/attendances');
export const createAttendance = (data) => api.post('/attendances', data);
export const updateAttendance = (id, data) => api.put(`/attendances/${id}`, data);
export const deleteAttendance = (id) => api.delete(`/attendances/${id}`);

// Leave Requests
export const getLeaveRequests = () => api.get('/leave-requests');
export const getLeaveRequest = (id) => api.get(`/leave-requests/${id}`);
export const createLeaveRequest = (data) => api.post('/leave-requests', data);
export const updateLeaveRequest = (id, data) => api.put(`/leave-requests/${id}`, data);
export const deleteLeaveRequest = (id) => api.delete(`/leave-requests/${id}`);
export const approveLeaveRequest = (id) => api.post(`/leave-requests/${id}/approve`);
export const rejectLeaveRequest = (id) => api.post(`/leave-requests/${id}/reject`);

// Payroll
export const getPayrolls = () => api.get('/payrolls');
export const getPayroll = (id) => api.get(`/payrolls/${id}`);
export const createPayroll = (data) => api.post('/payrolls', data);
export const updatePayroll = (id, data) => api.put(`/payrolls/${id}`, data);
export const deletePayroll = (id) => api.delete(`/payrolls/${id}`);

// Jobs & Recruitment
export const getJobs = () => api.get('/jobs');
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);

// Performance Evaluations
export const getPerformanceEvaluations = () => api.get('/performance-evaluations');
export const getPerformanceEvaluation = (id) => api.get(`/performance-evaluations/${id}`);
export const createPerformanceEvaluation = (data) => api.post('/performance-evaluations', data);
export const updatePerformanceEvaluation = (id, data) => api.put(`/performance-evaluations/${id}`, data);
export const deletePerformanceEvaluation = (id) => api.delete(`/performance-evaluations/${id}`);

// Dashboard Statistics
export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;
