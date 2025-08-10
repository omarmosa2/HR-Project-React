import React, { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                  Jobs & Recruitment
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Manage job postings and recruitment processes for your organization.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{jobs.filter(j => j.status === 'Open').length} Open Positions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{jobs.filter(j => j.status === 'Closed').length} Closed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{jobs.reduce((acc, job) => acc + job.applicants, 0)} Total Applicants</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ExcelExportButton
              data={jobs}
              filename="job_listings"
              sheetName="الوظائف"
              columns={[
                { key: 'title', header: 'المسمى الوظيفي' },
                { key: 'department', header: 'القسم' },
                { key: 'location', header: 'الموقع' },
                { key: 'salary_range', header: 'نطاق الراتب' },
                { key: 'posted_date', header: 'تاريخ النشر' },
                { key: 'closing_date', header: 'تاريخ الإغلاق' },
                { key: 'applicants', header: 'عدد المتقدمين' },
                { key: 'status', header: 'الحالة' }
              ]}
              buttonText="Export to Excel"
              className="btn-secondary flex items-center gap-2"
            />
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                </svg>
                Job Listings
                <span className="ml-2 badge badge-primary">{jobs.filter(job => job.status === 'Open').length} Open</span>
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Showing {jobs.length} job postings
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs by title or department..."
                className="input pl-10 w-full"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
                All Jobs
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                Open
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                Closed
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">Job Title</th>
                <th className="text-left">Department</th>
                <th className="text-left">Location</th>
                <th className="text-left">Posted Date</th>
                <th className="text-left">Closing Date</th>
                <th className="text-left">Applicants</th>
                <th className="text-left">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-secondary-400 dark:text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                          No job listings found
                        </h3>
                        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                          Get started by posting your first job opening
                        </p>
                      </div>
                      <button className="btn-primary mt-2 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Post First Job
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-700/50 transition-colors duration-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0V6a2 2 0 00-2 2v6" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">{job.title}</div>
                          <div className="text-sm text-secondary-500 dark:text-secondary-400">{job.salary_range}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {job.department}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        job.location === 'Remote' ? 'badge-success' :
                        job.location === 'Office' ? 'badge-primary' : 'badge-secondary'
                      }`}>
                        {job.location}
                      </span>
                    </td>
                    <td>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {new Date(job.posted_date).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {new Date(job.closing_date).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-primary">
                          {job.applicants}
                        </span>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">applicants</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        job.status === 'Open' ? 'badge-success' : 'badge-danger'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button className="btn-ghost btn-sm text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn-ghost btn-sm text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700">
                          View Details
                        </button>
                        <button className="btn-ghost btn-sm text-danger-600 hover:text-danger-700 hover:bg-danger-50 dark:hover:bg-danger-900/20">
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
}
