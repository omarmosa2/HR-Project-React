import React, { useState, useEffect } from "react";
import { getEmployees } from "../../lib/api";

const AttendanceForm = ({ onSubmit, initialData = {} }) => {
  const [attendance, setAttendance] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    check_in: '',
    check_out: '',
    status: 'present',
    ...initialData
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      setEmployees(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendance({ ...attendance, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(attendance);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Employee *
          </label>
          <select
            name="employee_id"
            value={attendance.employee_id}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Date *
          </label>
          <input
            type="date"
            name="date"
            value={attendance.date}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Check-in Time
          </label>
          <input
            type="time"
            name="check_in"
            value={attendance.check_in}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Check-out Time
          </label>
          <input
            type="time"
            name="check_out"
            value={attendance.check_out}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-secondary-700">
            Status *
          </label>
          <select
            name="status"
            value={attendance.status}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-secondary-200">
        <button
          type="button"
          onClick={() => setAttendance({
            employee_id: '',
            date: new Date().toISOString().split('T')[0],
            check_in: '',
            check_out: '',
            status: 'present'
          })}
          className="btn-secondary"
        >
          Reset Form
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData.id ? "Update Attendance" : "Mark Attendance"}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;
