import React, { useEffect, useState } from "react";
import { DollarSign, Plus, FileDown, FileText, Edit, Trash2, Search, Filter, Download, X, Calculator, TrendingUp, Users } from "lucide-react";
import { getPayrolls, createPayroll, updatePayroll, deletePayroll } from "../../lib/api";
import PayrollForm from "./PayrollForm";
import ExcelExportButton from "../common/ExcelExportButton.jsx";

export default function PayrollManagementView() {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");

  useEffect(() => {
    fetchPayrolls();
  }, []);

  useEffect(() => {
    filterPayrolls();
  }, [payrolls, searchTerm, statusFilter, periodFilter]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await getPayrolls();
      setPayrolls(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPayrolls = () => {
    let filtered = payrolls;

    if (searchTerm) {
      filtered = filtered.filter(payroll =>
        payroll.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payroll.employee?.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payroll.period?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(payroll => payroll.status === statusFilter);
    }

    if (periodFilter) {
      filtered = filtered.filter(payroll => payroll.period === periodFilter);
    }

    setFilteredPayrolls(filtered);
  };

  const getStatuses = () => {
    return [...new Set(payrolls.map(p => p.status).filter(Boolean))];
  };

  const getPeriods = () => {
    return [...new Set(payrolls.map(p => p.period).filter(Boolean))];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPeriodFilter("");
  };

  const handleAdd = async (payrollData) => {
    try {
      const response = await createPayroll(payrollData);
      setPayrolls([...payrolls, response.data]);
      setIsAdding(false);
      alert("Payroll record added successfully!");
    } catch (error) {
      console.error("Error adding payroll:", error);
      alert("Error adding payroll record. Please try again.");
    }
  };

  const handleUpdate = async (payrollData) => {
    try {
      await updatePayroll(payrollData.id, payrollData);
      fetchPayrolls();
      setSelectedPayroll(null);
      alert("Payroll record updated successfully!");
    } catch (error) {
      console.error("Error updating payroll:", error);
      alert("Error updating payroll record. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      try {
        await deletePayroll(id);
        fetchPayrolls();
        alert("Payroll record deleted successfully!");
      } catch (error) {
        console.error("Error deleting payroll:", error);
        alert("Error deleting payroll record. Please try again.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'badge-success';
      case 'processed': return 'badge-primary';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const calculateTotals = () => {
    const data = filteredPayrolls.length > 0 ? filteredPayrolls : payrolls;
    const totalPayroll = data.reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0);
    const avgSalary = data.length > 0 ? totalPayroll / data.length : 0;
    const highestSalary = data.length > 0 ? Math.max(...data.map(p => parseFloat(p.net_salary || 0))) : 0;
    const lowestSalary = data.length > 0 ? Math.min(...data.map(p => parseFloat(p.net_salary || 0))) : 0;
    const totalBonuses = data.reduce((sum, p) => sum + parseFloat(p.bonuses || 0), 0);
    const totalDeductions = data.reduce((sum, p) => sum + parseFloat(p.deductions || 0), 0);

    return { totalPayroll, avgSalary, highestSalary, lowestSalary, totalBonuses, totalDeductions };
  };

  const totals = calculateTotals();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                  Payroll Management
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Process and manage employee salaries and compensation packages.
                </p>
              </div>
            </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">
                    {payrolls.filter(p => p.status === 'paid').length} Paid This Month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">
                    {payrolls.filter(p => p.status === 'pending').length} Pending
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">
                    {filteredPayrolls.length} Filtered Results
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ExcelExportButton
                data={filteredPayrolls.map(payroll => ({
                  employee_name: payroll.employee?.name || 'Unknown',
                  employee_position: payroll.employee?.position || '-',
                  period: payroll.period,
                  base_salary: parseFloat(payroll.base_salary || 0).toFixed(2),
                  overtime_hours: payroll.overtime_hours || 0,
                  overtime_rate: parseFloat(payroll.overtime_rate || 0).toFixed(2),
                  bonuses: parseFloat(payroll.bonuses || 0).toFixed(2),
                  deductions: parseFloat(payroll.deductions || 0).toFixed(2),
                  net_salary: parseFloat(payroll.net_salary || 0).toFixed(2),
                  status: payroll.status || 'pending'
                }))}
                filename="payroll"
                sheetName="الرواتب"
                columns={[
                  { key: 'employee_name', header: 'اسم الموظف' },
                  { key: 'employee_position', header: 'المنصب' },
                  { key: 'period', header: 'الفترة' },
                  { key: 'base_salary', header: 'الراتب الأساسي' },
                  { key: 'overtime_hours', header: 'ساعات إضافية' },
                  { key: 'overtime_rate', header: 'معدل الساعة الإضافية' },
                  { key: 'bonuses', header: 'المكافآت' },
                  { key: 'deductions', header: 'الخصومات' },
                  { key: 'net_salary', header: 'صافي الراتب' },
                  { key: 'status', header: 'الحالة' }
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
                Process Payroll
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
                  placeholder="Search by employee name, position, or period..."
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
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="input pl-10 min-w-[120px]"
                >
                  <option value="">All Periods</option>
                  {getPeriods().map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>

              {(searchTerm || statusFilter || periodFilter) && (
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
        {(isAdding || selectedPayroll) && (
          <div className="card animate-slide-down">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {isAdding ? 'Process New Payroll' : 'Edit Payroll Record'}
                  </h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    {isAdding ? 'Calculate and process employee salary' : 'Update payroll information'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setSelectedPayroll(null);
                }}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="card-body">
              <PayrollForm
                onSubmit={isAdding ? handleAdd : handleUpdate}
                initialData={selectedPayroll || {}}
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
                    <p className="text-sm font-medium text-secondary-600">Total Payroll</p>
                    <p className="text-2xl font-bold text-success-600">
                      ${totals.totalPayroll.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Average Salary</p>
                    <p className="text-2xl font-bold text-primary-600">
                      ${totals.avgSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Records</p>
                    <p className="text-2xl font-bold text-secondary-600">
                      {payrolls.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">Total Bonuses</p>
                    <p className="text-2xl font-bold text-warning-600">
                      ${totals.totalBonuses.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Records */}
          <div className="lg:col-span-3 card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-success-600" />
                    Payroll Records
                  </h3>
                  <p className="text-sm text-secondary-600 mt-1">
                    {loading ? 'Loading payroll records...' : `Showing ${filteredPayrolls.length} of ${payrolls.length} records`}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-left">Employee</th>
                    <th className="text-left">Period</th>
                    <th className="text-left">Base Salary</th>
                    <th className="text-left">Bonuses</th>
                    <th className="text-left">Deductions</th>
                    <th className="text-left">Net Salary</th>
                    <th className="text-left">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          <p className="text-secondary-600">Loading payroll records...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPayrolls.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                            {searchTerm || statusFilter || periodFilter ? (
                              <Search className="w-8 h-8 text-secondary-400" />
                            ) : (
                              <DollarSign className="w-8 h-8 text-secondary-400" />
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-medium text-secondary-900">
                              {searchTerm || statusFilter || periodFilter
                                ? 'No payroll records match your filters'
                                : 'No payroll records found'
                              }
                            </h3>
                            <p className="text-secondary-600 mt-1">
                              {searchTerm || statusFilter || periodFilter
                                ? 'Try adjusting your search criteria or clear filters'
                                : 'Get started by processing your first payroll'
                              }
                            </p>
                          </div>
                          {!(searchTerm || statusFilter || periodFilter) && (
                            <button
                              onClick={() => setIsAdding(true)}
                              className="btn-primary mt-2 flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Process First Payroll
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredPayrolls.map((payroll) => (
                      <tr key={payroll.id} className="hover:bg-secondary-50/50 transition-colors duration-200">
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-xl flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {(payroll.employee?.name || 'E').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-secondary-900 truncate">
                                {payroll.employee?.name || 'Unknown Employee'}
                              </div>
                              <div className="text-sm text-secondary-500 truncate">
                                {payroll.employee?.position || 'No position'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="font-medium text-secondary-900">{payroll.period}</div>
                        </td>
                        <td>
                          <div className="font-bold text-secondary-900">
                            ${parseFloat(payroll.base_salary || 0).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-success-600">
                            +${parseFloat(payroll.bonuses || 0).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div className="font-semibold text-danger-600">
                            -${parseFloat(payroll.deductions || 0).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div className="font-bold text-lg text-secondary-900">
                            ${parseFloat(payroll.net_salary || 0).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusColor(payroll.status)}`}>
                            {payroll.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedPayroll(payroll)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                              title="Edit Payroll"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(payroll.id)}
                              className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                              title="Delete Payroll"
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


