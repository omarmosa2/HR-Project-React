import React, { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Plus, Edit, Trash2, Search, Filter, Download, X, CalendarDays, Users, TrendingUp } from "lucide-react";
import { getLeaveRequests, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest } from "../../lib/api";
import LeaveRequestForm from "./LeaveRequestForm";
import ExcelExportButton from "../common/ExcelExportButton.jsx";

export default function LeaveManagementView() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterLeaveRequests();
  }, [leaveRequests, searchTerm, statusFilter, typeFilter]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await getLeaveRequests();
      setLeaveRequests(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterLeaveRequests = () => {
    let filtered = leaveRequests;

    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    setFilteredLeaveRequests(filtered);
  };

  const getStatuses = () => {
    return [...new Set(leaveRequests.map(r => r.status).filter(Boolean))];
  };

  const getTypes = () => {
    return [...new Set(leaveRequests.map(r => r.type).filter(Boolean))];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
  };

  const handleAdd = async (leaveRequestData) => {
    try {
      const response = await createLeaveRequest(leaveRequestData);
      setLeaveRequests([...leaveRequests, response.data]);
      setIsAdding(false);
      alert("Leave request added successfully!");
    } catch (error) {
      console.error("Error adding leave request:", error);
      alert("Error adding leave request. Please try again.");
    }
  };

  const handleUpdate = async (leaveRequestData) => {
    try {
      await updateLeaveRequest(leaveRequestData.id, leaveRequestData);
      fetchLeaveRequests();
      setSelectedLeaveRequest(null);
      alert("Leave request updated successfully!");
    } catch (error) {
      console.error("Error updating leave request:", error);
      alert("Error updating leave request. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      try {
        await deleteLeaveRequest(id);
        fetchLeaveRequests();
        alert("Leave request deleted successfully!");
      } catch (error) {
        console.error("Error deleting leave request:", error);
        alert("Error deleting leave request. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'vacation': return 'badge-primary';
      case 'sick': return 'badge-danger';
      case 'personal': return 'badge-secondary';
      case 'maternity': return 'badge-warning';
      case 'emergency': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const calculateStats = () => {
    const data = filteredLeaveRequests.length > 0 ? filteredLeaveRequests : leaveRequests;
    const totalRequests = data.length;
    const approvedRequests = data.filter(r => r.status === 'approved').length;
    const pendingRequests = data.filter(r => r.status === 'pending').length;
    const rejectedRequests = data.filter(r => r.status === 'rejected').length;
    const totalDays = data.reduce((sum, r) => {
      const fromDate = new Date(r.from_date);
      const toDate = new Date(r.to_date);
      const duration = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
      return sum + duration;
    }, 0);

    return { totalRequests, approvedRequests, pendingRequests, rejectedRequests, totalDays };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200/50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Leave Management
                  </h1>
                  <p className="text-secondary-600">
                    Track and process employee leave requests and time-off applications.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{stats.approvedRequests} Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{stats.pendingRequests} Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{stats.rejectedRequests} Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{filteredLeaveRequests.length} Filtered Results</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ExcelExportButton
                data={filteredLeaveRequests.map(leave => ({
                  employee_name: leave.employee?.name || 'Unknown',
                  employee_position: leave.employee?.position || '-',
                  leave_type: leave.type,
                  start_date: leave.from_date,
                  end_date: leave.to_date,
                  duration: Math.ceil((new Date(leave.to_date) - new Date(leave.from_date)) / (1000 * 60 * 60 * 24)) + 1,
                  reason: leave.reason || '',
                  status: leave.status,
                  applied_date: leave.created_at ? new Date(leave.created_at).toLocaleDateString() : ''
                }))}
                filename="leave_requests"
                sheetName="طلبات الإجازة"
                columns={[
                  { key: 'employee_name', header: 'اسم الموظف' },
                  { key: 'employee_position', header: 'المنصب' },
                  { key: 'leave_type', header: 'نوع الإجازة' },
                  { key: 'start_date', header: 'تاريخ البداية' },
                  { key: 'end_date', header: 'تاريخ النهاية' },
                  { key: 'duration', header: 'المدة (أيام)' },
                  { key: 'reason', header: 'السبب' },
                  { key: 'status', header: 'الحالة' },
                  { key: 'applied_date', header: 'تاريخ التقديم' }
                ]}
                buttonText="Export to Excel"
                className="btn-secondary flex items-center gap-2"
                icon={<Download className="w-4 h-4" />}
              />
              <button
                onClick={() => setIsAdding(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Leave Request
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search by employee name, position, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input pl-10 min-w-[120px]"
                >
                  <option value="">All Status</option>
                  {getStatuses().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input pl-10 min-w-[120px]"
                >
                  <option value="">All Types</option>
                  {getTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {(searchTerm || statusFilter || typeFilter) && (
                <button
                  onClick={clearFilters}
                  className="btn-secondary whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || selectedLeaveRequest) && (
          <div className="card animate-slide-down">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {isAdding ? 'New Leave Request' : 'Edit Leave Request'}
                  </h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    {isAdding ? 'Submit a new leave application' : 'Update leave request details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setSelectedLeaveRequest(null);
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="card-body">
              <LeaveRequestForm
                onSubmit={isAdding ? handleAdd : handleUpdate}
                initialData={selectedLeaveRequest || {}}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Statistics Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Requests</p>
                    <p className="text-2xl font-bold text-secondary-600">
                      {stats.totalRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-secondary-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Approved</p>
                    <p className="text-2xl font-bold text-success-600">
                      {stats.approvedRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Pending</p>
                    <p className="text-2xl font-bold text-warning-600">
                      {stats.pendingRequests}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Days</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {stats.totalDays}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="lg:col-span-3 card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    Leave Requests
                  </h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    {loading ? 'Loading leave requests...' : `Showing ${filteredLeaveRequests.length} of ${leaveRequests.length} requests`}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-left">Employee</th>
                    <th className="text-left">Type</th>
                    <th className="text-left">Date Range</th>
                    <th className="text-left">Duration</th>
                    <th className="text-left">Reason</th>
                    <th className="text-left">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          <p className="text-secondary-600">Loading leave requests...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredLeaveRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                            {searchTerm || statusFilter || typeFilter ? (
                              <Search className="w-8 h-8 text-secondary-400" />
                            ) : (
                              <Calendar className="w-8 h-8 text-secondary-400" />
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-secondary-900">
                              {searchTerm || statusFilter || typeFilter
                                ? 'No leave requests match your filters'
                                : 'No leave requests found'
                              }
                            </h3>
                            <p className="text-secondary-600 mt-1">
                              {searchTerm || statusFilter || typeFilter
                                ? 'Try adjusting your search criteria or clear filters'
                                : 'Get started by submitting your first leave request'
                              }
                            </p>
                          </div>
                          {!(searchTerm || statusFilter || typeFilter) && (
                            <button
                              onClick={() => setIsAdding(true)}
                              className="btn-primary mt-2 flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Submit First Request
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeaveRequests.map((request) => {
                      const fromDate = new Date(request.from_date);
                      const toDate = new Date(request.to_date);
                      const duration = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

                      return (
                        <tr key={request.id} className="hover:bg-secondary-50/50 transition-colors duration-200">
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                                <span className="text-white font-semibold text-sm">
                                  {(request.employee?.name || 'E').charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-secondary-900 truncate">
                                  {request.employee?.name || 'Unknown Employee'}
                                </div>
                                <div className="text-sm text-secondary-500 truncate">
                                  {request.employee?.position || 'No position'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getTypeColor(request.type)}`}>
                              {request.type}
                            </span>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="font-medium text-secondary-900">
                                {new Date(request.from_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-secondary-500">
                                to {new Date(request.to_date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="font-bold text-secondary-900">
                              {duration} {duration === 1 ? 'day' : 'days'}
                            </div>
                          </td>
                          <td>
                            <div className="text-secondary-600 text-sm max-w-xs truncate">
                              {request.reason || 'No reason provided'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setSelectedLeaveRequest(request)}
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                                title="Edit Leave Request"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(request.id)}
                                className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                                title="Delete Leave Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


