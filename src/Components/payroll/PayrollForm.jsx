import React, { useState, useEffect } from "react";
import { getEmployees } from "../../lib/api";

const PayrollForm = ({ onSubmit, initialData = {} }) => {
  const [payroll, setPayroll] = useState({
    employee_id: '',
    period: new Date().toISOString().slice(0, 7), // YYYY-MM format
    base_salary: '',
    additions: 0,
    deductions: 0,
    status: 'pending',
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
    setPayroll({ ...payroll, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payroll);
  };

  const calculateNetSalary = () => {
    const base = parseFloat(payroll.base_salary) || 0;
    const additions = parseFloat(payroll.additions) || 0;
    const deductions = parseFloat(payroll.deductions) || 0;
    return base + additions - deductions;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {initialData.id ? "Update Payroll Record" : "Add Payroll Record"}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <select
            name="employee_id"
            value={payroll.employee_id}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Period (YYYY-MM)</label>
          <input
            type="month"
            name="period"
            value={payroll.period}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Base Salary</label>
          <input
            type="number"
            name="base_salary"
            value={payroll.base_salary}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Additions (Bonuses, Overtime)</label>
          <input
            type="number"
            name="additions"
            value={payroll.additions}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            step="0.01"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Deductions (Taxes, Insurance)</label>
          <input
            type="number"
            name="deductions"
            value={payroll.deductions}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            step="0.01"
            min="0"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={payroll.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="pending">Pending</option>
            <option value="processed">Processed</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        
        <div className="col-span-2">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Salary Calculation</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Base Salary:</span>
                <div className="font-semibold">${parseFloat(payroll.base_salary || 0).toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">+ Additions:</span>
                <div className="font-semibold text-green-600">+${parseFloat(payroll.additions || 0).toFixed(2)}</div>
              </div>
              <div>
                <span className="text-gray-600">- Deductions:</span>
                <div className="font-semibold text-red-600">-${parseFloat(payroll.deductions || 0).toFixed(2)}</div>
              </div>
            </div>
            <div className="border-t mt-2 pt-2">
              <span className="text-gray-600">Net Salary:</span>
              <div className="font-bold text-lg text-blue-600">${calculateNetSalary().toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {initialData.id ? "Update" : "Add"} Payroll Record
        </button>
        <button 
          type="button" 
          onClick={() => setPayroll({
            employee_id: '',
            period: new Date().toISOString().slice(0, 7),
            base_salary: '',
            additions: 0,
            deductions: 0,
            status: 'pending'
          })}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default PayrollForm;
