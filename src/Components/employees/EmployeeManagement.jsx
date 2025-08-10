import React, { useState, useEffect } from "react";
import { Users, Plus, Search, Filter, Download, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import EmployeeForm from "./EmployeeForm.jsx";
import ExcelExportButton from "../common/ExcelExportButton.jsx";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../lib/api";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, positionFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getEmployees();
      const employeesData = response.data.data || response.data;

      // تأكد من أن البيانات مصفوفة وأن كل عنصر يحتوي على الخصائص المطلوبة
      const processedEmployees = Array.isArray(employeesData)
        ? employeesData.map(emp => ({
            id: emp.id || '',
            name: emp.name || '',
            position: typeof emp.position === 'object' ? emp.position?.name || '' : emp.position || '',
            department: typeof emp.department === 'object' ? emp.department?.name || '' : emp.department || '',
            salary: emp.salary || 0,
            hire_date: emp.hire_date || new Date().toISOString().split('T')[0],
            email: emp.email || '',
            phone: emp.phone || '',
            address: emp.address || ''
          }))
        : [];

      setEmployees(processedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
      // في حالة الخطأ، اعرض مصفوفة فارغة
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (positionFilter) {
      filtered = filtered.filter(emp => emp.position === positionFilter);
    }

    setFilteredEmployees(filtered);
  };

  const getDepartments = () => {
    return [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  };

  const getPositions = () => {
    return [...new Set(employees.map(emp => emp.position).filter(Boolean))];
  };

  const handleAdd = async (employeeData) => {
    try {
      const response = await createEmployee(employeeData);
      const newEmployee = response.data;
      setEmployees([...employees, newEmployee]);
      setIsAdding(false);
      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error adding employee. Please try again.");
      }
    }
  };

  const handleUpdate = async (employeeData) => {
    try {
      await updateEmployee(employeeData.id, employeeData);
      fetchEmployees();
      setSelectedEmployee(null);
      alert("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error updating employee. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        alert("Employee deleted successfully!");
      } catch (error) {
        console.error("Error deleting employee:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please login again.");
        } else {
          alert("Error deleting employee. Please try again.");
        }
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("");
    setPositionFilter("");
  };

  // Define columns for Excel export
  const exportColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'الاسم' },
    { key: 'position', header: 'المنصب' },
    { key: 'department', header: 'القسم' },
    { key: 'salary', header: 'الراتب' },
    { key: 'hire_date', header: 'تاريخ التوظيف' },
    { key: 'email', header: 'البريد الإلكتروني' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                  Employee Management
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Manage your team members, track their information, and maintain employee records.
                </p>
              </div>
            </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{employees.length} Total Employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{filteredEmployees.length} Filtered Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{getDepartments().length} Departments</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ExcelExportButton
                data={filteredEmployees}
                filename="employees"
                sheetName="الموظفين"
                columns={exportColumns}
                buttonText="Export to Excel"
                className="btn-secondary flex items-center gap-2"
                icon={<Download className="w-4 h-4" />}
              />
              <button
                onClick={() => setIsAdding(true)}
                className="btn-primary flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                <input
                  type="text"
                  placeholder="Search employees by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="input pl-10 min-w-[150px]"
                >
                  <option value="">All Departments</option>
                  {getDepartments().map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 dark:text-secondary-500" />
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="input pl-10 min-w-[150px]"
                >
                  <option value="">All Positions</option>
                  {getPositions().map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              {(searchTerm || departmentFilter || positionFilter) && (
                <button
                  onClick={clearFilters}
                  className="btn-secondary whitespace-nowrap flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Forms */}
        {isAdding && (
          <div className="card animate-slide-down">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">Add New Employee</h3>
                  <p className="text-sm text-secondary-600 mt-1">Fill in the employee information below</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="card-body">
              <EmployeeForm onSubmit={handleAdd} />
            </div>
          </div>
        )}

        {selectedEmployee && (
          <div className="card animate-slide-down">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">Edit Employee</h3>
                  <p className="text-sm text-secondary-600 mt-1">Update employee information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="card-body">
              <EmployeeForm
                onSubmit={handleUpdate}
                initialData={selectedEmployee}
              />
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Employee Directory
                </h3>
                <p className="text-sm text-secondary-600 mt-1">
                  {loading ? 'Loading employees...' : `Showing ${filteredEmployees.length} of ${employees.length} employees`}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Employee</th>
                  <th className="text-left">Position</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Salary</th>
                  <th className="text-left">Hire Date</th>
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
                        <p className="text-secondary-600">Loading employees...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                          {searchTerm || departmentFilter || positionFilter ? (
                            <Search className="w-8 h-8 text-secondary-400" />
                          ) : (
                            <Users className="w-8 h-8 text-secondary-400" />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-secondary-900">
                            {searchTerm || departmentFilter || positionFilter
                              ? 'No employees match your filters'
                              : 'No employees found'
                            }
                          </h3>
                          <p className="text-secondary-600 mt-1">
                            {searchTerm || departmentFilter || positionFilter
                              ? 'Try adjusting your search criteria or clear filters'
                              : 'Get started by adding your first employee'
                            }
                          </p>
                        </div>
                        {!(searchTerm || departmentFilter || positionFilter) && (
                          <button
                            onClick={() => setIsAdding(true)}
                            className="btn-primary mt-2 flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add First Employee
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id || Math.random()} className="hover:bg-secondary-50/50 transition-colors duration-200">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {(employee.name || 'N').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-secondary-900 truncate">{employee.name || 'N/A'}</div>
                            <div className="text-sm text-secondary-500 truncate">{employee.email || 'No email'}</div>
                            {employee.phone && (
                              <div className="text-xs text-secondary-400 truncate">{employee.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-secondary-900">
                          {typeof employee.position === 'object'
                            ? employee.position?.name || 'N/A'
                            : employee.position || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {typeof employee.department === 'object'
                            ? employee.department?.name || 'N/A'
                            : employee.department || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold text-success-600">
                          ${(employee.salary || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-secondary-500">Annual</div>
                      </td>
                      <td>
                        <div className="text-secondary-900 font-medium">
                          {employee.hire_date
                            ? new Date(employee.hire_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'}
                        </div>
                        {employee.hire_date && (
                          <div className="text-xs text-secondary-500">
                            {Math.floor((new Date() - new Date(employee.hire_date)) / (1000 * 60 * 60 * 24 * 365))} years
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          <div className="w-1.5 h-1.5 bg-success-400 rounded-full mr-1.5"></div>
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                            title="Delete Employee"
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

  );
};

export default EmployeeManagement;
