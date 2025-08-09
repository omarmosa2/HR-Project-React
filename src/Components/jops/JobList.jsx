import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import ExcelExportButton from "../common/ExcelExportButton.jsx";

export default function JobsRecruitmentView() {
  // Sample job data for demonstration
  const [jobs] = useState([
    {
      id: 1,
      title: "Software Engineer",
      department: "IT",
      posted_date: "2024-01-15",
      closing_date: "2024-02-15",
      applicants: 25,
      status: "Open",
      location: "Remote",
      salary_range: "$60,000 - $80,000"
    },
    {
      id: 2,
      title: "HR Manager",
      department: "Human Resources",
      posted_date: "2024-01-10",
      closing_date: "2024-02-10",
      applicants: 15,
      status: "Open",
      location: "Office",
      salary_range: "$50,000 - $65,000"
    },
    {
      id: 3,
      title: "Marketing Specialist",
      department: "Marketing",
      posted_date: "2024-01-05",
      closing_date: "2024-02-05",
      applicants: 30,
      status: "Closed",
      location: "Hybrid",
      salary_range: "$45,000 - $55,000"
    }
  ]);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Jobs & Recruitment</h1>
        <p className="text-gray-600">Manage job postings and recruitment processes</p>
      </div>

      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold">Job Listings <span className="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{jobs.filter(job => job.status === 'Open').length} Open Positions</span></h2>
            <p className="text-sm text-gray-500">Create and manage job postings</p>
          </div>
          <div className="flex gap-2">
            <ExcelExportButton
              data={jobs}
              filename="job_listings"
              sheetName="الوظائف"
              columns={[
                { key: 'title', header: 'المسمى الوظيفي' },
                { key: 'department', header: 'القسم' },
                { key: 'posted_date', header: 'تاريخ النشر' },
                { key: 'closing_date', header: 'تاريخ الإغلاق' },
                { key: 'applicants', header: 'عدد المتقدمين' },
                { key: 'status', header: 'الحالة' },
                { key: 'location', header: 'مكان العمل' },
                { key: 'salary_range', header: 'نطاق الراتب' }
              ]}
              buttonText="تصدير إلى Excel"
            />
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              <Plus className="w-4 h-4" />
              Add New Job
            </button>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mb-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-1 rounded-md bg-white text-sm font-medium shadow">Open</button>
            <button className="px-4 py-1 rounded-md text-sm text-gray-600">Closed</button>
            <button className="px-4 py-1 rounded-md text-sm text-gray-600">Draft</button>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full px-4 py-2 pl-10 border rounded-lg text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="py-2">Job Title</th>
                <th className="py-2">Department</th>
                <th className="py-2">Posted Date</th>
                <th className="py-2">Closing Date</th>
                <th className="py-2">Applicants</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No job listings found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.salary_range}</div>
                    </td>
                    <td className="py-3">{job.department}</td>
                    <td className="py-3">{new Date(job.posted_date).toLocaleDateString()}</td>
                    <td className="py-3">{new Date(job.closing_date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {job.applicants} applicants
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'Open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View Details
                      </button>
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
}
