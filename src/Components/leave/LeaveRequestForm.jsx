import React, { useState, useEffect } from "react";
import { getEmployees } from "../../lib/api";

const LeaveRequestForm = ({ onSubmit, initialData = {} }) => {
  const [leaveRequest, setLeaveRequest] = useState({
    employee_id: '',
    from_date: '',
    to_date: '',
    type: 'vacation',
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
    setLeaveRequest({ ...leaveRequest, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(leaveRequest);
  };

  const calculateDays = () => {
    if (leaveRequest.from_date && leaveRequest.to_date) {
      const fromDate = new Date(leaveRequest.from_date);
      const toDate = new Date(leaveRequest.to_date);
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">
        {initialData.id ? "Update Leave Request" : "Add Leave Request"}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <select
            name="employee_id"
            value={leaveRequest.employee_id}
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
          <label className="block mb-1 font-medium">Leave Type</label>
          <select
            name="type"
            value={leaveRequest.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal</option>
            <option value="maternity">Maternity</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1 font-medium">From Date</label>
          <input
            type="date"
            name="from_date"
            value={leaveRequest.from_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">To Date</label>
          <input
            type="date"
            name="to_date"
            value={leaveRequest.to_date}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={leaveRequest.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <div className="bg-gray-100 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Duration: </span>
            <span className="font-semibold">{calculateDays()} days</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {initialData.id ? "Update" : "Add"} Leave Request
        </button>
        <button 
          type="button" 
          onClick={() => setLeaveRequest({
            employee_id: '',
            from_date: '',
            to_date: '',
            type: 'vacation',
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

export default LeaveRequestForm;
