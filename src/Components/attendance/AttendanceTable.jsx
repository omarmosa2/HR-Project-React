
import React, { useEffect, useState } from "react";
import { CalendarDays, Plus, Edit, Trash2, Search } from "lucide-react";
import { getAttendances, createAttendance, updateAttendance, deleteAttendance } from "../../lib/api";
import AttendanceForm from "./AttendanceForm";
import ExcelExportButton from "../common/ExcelExportButton.jsx";

export default function AttendanceView() {
  const [attendances, setAttendances] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const response = await getAttendances();
      setAttendances(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching attendances:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (attendanceData) => {
    try {
      const response = await createAttendance(attendanceData);
      setAttendances([...attendances, response.data]);
      setIsAdding(false);
      alert("Attendance record added successfully!");
    } catch (error) {
      console.error("Error adding attendance:", error);
      alert("Error adding attendance record. Please try again.");
    }
  };

  const handleUpdate = async (attendanceData) => {
    try {
      await updateAttendance(attendanceData.id, attendanceData);
      fetchAttendances();
      setSelectedAttendance(null);
      alert("Attendance record updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Error updating attendance record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      try {
        await deleteAttendance(id);
        fetchAttendances();
        alert("Attendance record deleted successfully!");
      } catch (error) {
        console.error("Error deleting attendance:", error);
        alert("Error deleting attendance record. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600';
      case 'absent': return 'text-red-600';
      case 'late': return 'text-yellow-600';
      case 'half_day': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'present': return 'badge-success';
      case 'absent': return 'badge-danger';
      case 'late': return 'badge-warning';
      case 'half_day': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-2">
              Attendance Management
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              Monitor and manage daily attendance records for all employees.
            </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600">Present Today: {attendances.filter(a => a.status === 'present').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600">Late: {attendances.filter(a => a.status === 'late').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600">Absent: {attendances.filter(a => a.status === 'absent').length}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ExcelExportButton
                data={attendances.map(att => ({
                  employee_name: att.employee?.name || 'N/A',
                  employee_position: att.employee?.position || 'N/A',
                  date: att.date,
                  check_in: att.check_in || '--:--',
                  check_out: att.check_out || '--:--',
                  status: att.status,
                  hours_worked: att.hours_worked || 0
                }))}
                filename="attendance"
                sheetName="الحضور"
                columns={[
                  { key: 'employee_name', header: 'اسم الموظف' },
                  { key: 'employee_position', header: 'المنصب' },
                  { key: 'date', header: 'التاريخ' },
                  { key: 'check_in', header: 'وقت الدخول' },
                  { key: 'check_out', header: 'وقت الخروج' },
                  { key: 'status', header: 'الحالة' },
                  { key: 'hours_worked', header: 'ساعات العمل' }
                ]}
                buttonText="Export to Excel"
                className="btn-secondary"
              />
              <button
                onClick={() => setIsAdding(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Mark Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || selectedAttendance) && (
          <div className="card animate-slide-down">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-secondary-900">
                {isAdding ? 'Mark Attendance' : 'Edit Attendance'}
              </h3>
              <p className="text-sm text-secondary-600 mt-1">
                {isAdding ? 'Record employee attendance for today' : 'Update attendance record'}
              </p>
            </div>
            <div className="card-body">
              <AttendanceForm
                onSubmit={isAdding ? handleAdd : handleUpdate}
                initialData={selectedAttendance || {}}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Present Today</p>
                    <p className="text-2xl font-bold text-success-600">
                      {attendances.filter(a => a.status === 'present').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Late Arrivals</p>
                    <p className="text-2xl font-bold text-warning-600">
                      {attendances.filter(a => a.status === 'late').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Absent</p>
                    <p className="text-2xl font-bold text-danger-600">
                      {attendances.filter(a => a.status === 'absent').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="lg:col-span-3 card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">Today's Attendance</h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                    <input
                      type="text"
                      placeholder="Search attendance records..."
                      className="input w-64 pl-10 pr-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          <p className="text-secondary-600">Loading attendance records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : attendances.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                            <CalendarDays className="w-8 h-8 text-secondary-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-secondary-900">No attendance records</h3>
                            <p className="text-secondary-600 mt-1">Start by marking attendance for employees</p>
                          </div>
                          <button
                            onClick={() => setIsAdding(true)}
                            className="btn-primary mt-2"
                          >
                            Mark First Attendance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    attendances.map((att) => (
                      <tr key={att.id} className="hover:bg-secondary-50/50 transition-colors duration-200">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-medium text-sm">
                                {(att.employee?.name || 'N').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-secondary-900">{att.employee?.name || "-"}</div>
                              <div className="text-sm text-secondary-500">{att.employee?.position || "-"}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-secondary-600">{att.date}</span>
                        </td>
                        <td>
                          <span className="font-medium text-secondary-900">
                            {att.check_in || "--:--"}
                          </span>
                        </td>
                        <td>
                          <span className="font-medium text-secondary-900">
                            {att.check_out || "--:--"}
                          </span>
                        </td>
                        <td>
                          <span className="font-medium text-secondary-600">
                            {att.hours_worked || 0}h
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeColor(att.status)}`}>
                            {att.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedAttendance(att)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                              title="Edit Attendance"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(att.id)}
                              className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                              title="Delete Attendance"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

  );
}
