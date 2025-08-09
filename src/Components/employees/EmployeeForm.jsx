import React, { useState } from "react";
import { User, Mail, Briefcase, Building, DollarSign, Calendar, Phone, MapPin } from "lucide-react";

const EmployeeForm = ({ onSubmit, initialData = {} }) => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    phone: '',
    address: '',
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(employee);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-secondary-200">
          <User className="w-5 h-5 text-primary-600" />
          <h4 className="text-lg font-semibold text-secondary-900">Personal Information</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                name="name"
                value={employee.name || ""}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Enter employee's full name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="email"
                name="email"
                value={employee.email || ""}
                onChange={handleChange}
                className="input pl-10"
                placeholder="employee@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="tel"
                name="phone"
                value={employee.phone || ""}
                onChange={handleChange}
                className="input pl-10"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                name="address"
                value={employee.address || ""}
                onChange={handleChange}
                className="input pl-10"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Work Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-secondary-200">
          <Briefcase className="w-5 h-5 text-primary-600" />
          <h4 className="text-lg font-semibold text-secondary-900">Work Information</h4>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Position *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <select
                name="position"
                value={employee.position || ""}
                onChange={handleChange}
                className="input pl-10"
                required
              >
                <option value="">Select Position</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Senior Software Engineer">Senior Software Engineer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="QA Engineer">QA Engineer</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Accountant">Accountant</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Department *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <select
                name="department"
                value={employee.department || ""}
                onChange={handleChange}
                className="input pl-10"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Annual Salary *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="number"
                name="salary"
                value={employee.salary || ""}
                onChange={handleChange}
                className="input pl-10"
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>
            <p className="text-xs text-secondary-500">Enter annual salary in USD</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-secondary-700">
              Hire Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="date"
                name="hire_date"
                value={employee.hire_date || ""}
                onChange={handleChange}
                className="input pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-secondary-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              {initialData.id ? (
                <>
                  <User className="w-4 h-4" />
                  Update Employee
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Add Employee
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
