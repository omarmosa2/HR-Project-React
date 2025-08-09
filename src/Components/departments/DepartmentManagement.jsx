import React, { useState, useEffect } from "react";
import { Building, Plus, Edit, Trash2, Users, Search, Download, X } from "lucide-react";
import ExcelExportButton from "../common/ExcelExportButton.jsx";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../../lib/api";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterDepartments();
  }, [departments, searchTerm]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getDepartments();
      const departmentsData = response.data.data || response.data;
      setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      }
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDepartments = () => {
    let filtered = departments;

    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredDepartments(filtered);
  };

  const handleAdd = async (departmentData) => {
    try {
      const response = await createDepartment(departmentData);
      const newDepartment = response.data;
      setDepartments([...departments, newDepartment]);
      setIsAdding(false);
      alert("Department added successfully!");
    } catch (error) {
      console.error("Error adding department:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error adding department. Please try again.");
      }
    }
  };

  const handleUpdate = async (departmentData) => {
    try {
      const response = await updateDepartment(selectedDepartment.id, departmentData);
      const updatedDepartment = response.data;
      setDepartments(departments.map(dept =>
        dept.id === selectedDepartment.id ? updatedDepartment : dept
      ));
      setSelectedDepartment(null);
      alert("Department updated successfully!");
    } catch (error) {
      console.error("Error updating department:", error);
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert("Error updating department. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      try {
        await deleteDepartment(id);
        setDepartments(departments.filter(dept => dept.id !== id));
        alert("Department deleted successfully!");
      } catch (error) {
        console.error("Error deleting department:", error);
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please login again.");
        } else {
          alert("Error deleting department. Please try again.");
        }
      }
    }
  };

  const DepartmentForm = ({ onSubmit, initialData = {} }) => {
    const [department, setDepartment] = useState({
      name: '',
      description: '',
      manager: '',
      budget: '',
      ...initialData
    });
    const [formLoading, setFormLoading] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setDepartment({ ...department, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      try {
        await onSubmit(department);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="card animate-slide-down">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {initialData.id ? 'Edit Department' : 'Add New Department'}
              </h3>
              <p className="text-sm text-secondary-600 mt-1">
                {initialData.id ? 'Update department information' : 'Create a new department for your organization'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAdding(false);
              setSelectedDepartment(null);
            }}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700">
                  Department Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    name="name"
                    value={department.name || ""}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="e.g. Engineering, Marketing, Sales"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700">
                  Department Manager
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                  <input
                    type="text"
                    name="manager"
                    value={department.manager || ""}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Manager name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700">
                  Annual Budget
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                  <input
                    type="number"
                    name="budget"
                    value={department.budget || ""}
                    onChange={handleChange}
                    className="input pl-8"
                    placeholder="100000"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium text-secondary-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={department.description || ""}
                  onChange={handleChange}
                  className="input resize-none"
                  rows="3"
                  placeholder="Brief description of the department's role and responsibilities"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-secondary-200">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setSelectedDepartment(null);
                }}
                className="btn-secondary"
                disabled={formLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={formLoading}
              >
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Building className="w-4 h-4" />
                    {initialData.id ? "Update Department" : "Add Department"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Define columns for Excel export
  const exportColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'اسم القسم' },
    { key: 'description', header: 'الوصف' },
    { key: 'manager', header: 'المدير' },
    { key: 'budget', header: 'الميزانية' },
    { key: 'employees_count', header: 'عدد الموظفين' },
    { key: 'created_at', header: 'تاريخ الإنشاء' }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200/50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-secondary-900">
                    Department Management
                  </h1>
                  <p className="text-secondary-600">
                    Organize your company structure and manage departmental information.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{departments.length} Total Departments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">{filteredDepartments.length} Filtered Results</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-secondary-600 font-medium">
                    {departments.reduce((total, dept) => total + (dept.employees?.length || 0), 0)} Total Employees
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ExcelExportButton
                data={filteredDepartments.map(dept => ({
                  ...dept,
                  employees_count: dept.employees?.length || 0,
                  budget: dept.budget ? `$${dept.budget.toLocaleString()}` : '',
                  created_at: dept.created_at ? new Date(dept.created_at).toLocaleDateString() : ''
                }))}
                filename="departments"
                sheetName="الأقسام"
                columns={exportColumns}
                buttonText="Export to Excel"
                className="btn-secondary flex items-center gap-2"
                icon={<Download className="w-4 h-4" />}
              />
              <button
                onClick={() => setIsAdding(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-soft border border-secondary-200/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search departments by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="btn-secondary whitespace-nowrap"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Forms */}
        {isAdding && (
          <DepartmentForm onSubmit={handleAdd} />
        )}

        {selectedDepartment && (
          <DepartmentForm
            onSubmit={handleUpdate}
            initialData={selectedDepartment}
          />
        )}

        {/* Departments Table */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary-600" />
                  Department Directory
                </h3>
                <p className="text-sm text-secondary-600 mt-1">
                  {loading ? 'Loading departments...' : `Showing ${filteredDepartments.length} of ${departments.length} departments`}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Department</th>
                  <th className="text-left">Manager</th>
                  <th className="text-left">Budget</th>
                  <th className="text-left">Employees</th>
                  <th className="text-left">Description</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <p className="text-secondary-600">Loading departments...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
                          {searchTerm ? (
                            <Search className="w-8 h-8 text-secondary-400" />
                          ) : (
                            <Building className="w-8 h-8 text-secondary-400" />
                          )}
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-secondary-900">
                            {searchTerm ? 'No departments match your search' : 'No departments found'}
                          </h3>
                          <p className="text-secondary-600 mt-1">
                            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first department'}
                          </p>
                        </div>
                        {!searchTerm && (
                          <button
                            onClick={() => setIsAdding(true)}
                            className="btn-primary mt-2 flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add First Department
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-secondary-50/50 transition-colors duration-200">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                            <Building className="w-6 h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-secondary-900 truncate">{department.name}</div>
                            <div className="text-sm text-secondary-500">Department ID: {department.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-secondary-900">
                          {department.manager || 'Not assigned'}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-success-600">
                          {department.budget ? `$${department.budget.toLocaleString()}` : 'Not set'}
                        </div>
                        {department.budget && (
                          <div className="text-xs text-secondary-500">Annual budget</div>
                        )}
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          <Users className="w-3 h-3 mr-1" />
                          {department.employees?.length || 0} employees
                        </span>
                      </td>
                      <td>
                        <div className="text-secondary-600 text-sm max-w-xs truncate">
                          {department.description || 'No description'}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedDepartment(department)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                            title="Edit Department"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(department.id)}
                            className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                            title="Delete Department"
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
};

export default DepartmentManagement;
