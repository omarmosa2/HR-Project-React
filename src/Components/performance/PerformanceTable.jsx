import React, { useState } from "react";
import { Plus, Search, Download, Edit, Trash2, TrendingUp } from "lucide-react";
import ExcelExportButton from "../common/ExcelExportButton.jsx";

export default function PerformanceEvaluationView() {
  // Sample performance evaluation data
  const [evaluations] = useState([
    {
      id: 1,
      employee_name: "أحمد محمد",
      employee_position: "مطور برمجيات",
      period: "Q4 2023",
      evaluation_date: "2024-01-15",
      rating: 4.5,
      status: "Completed",
      goals_achieved: 85,
      comments: "أداء ممتاز في المشاريع"
    },
    {
      id: 2,
      employee_name: "فاطمة علي",
      employee_position: "مدير الموارد البشرية",
      period: "Q4 2023",
      evaluation_date: "2024-01-12",
      rating: 4.2,
      status: "Completed",
      goals_achieved: 90,
      comments: "قيادة فعالة للفريق"
    },
    {
      id: 3,
      employee_name: "محمد حسن",
      employee_position: "أخصائي تسويق",
      period: "Q4 2023",
      evaluation_date: "2024-01-10",
      rating: 3.8,
      status: "In Review",
      goals_achieved: 75,
      comments: "يحتاج تحسين في التواصل"
    }
  ]);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-soft border border-secondary-200/50 dark:border-secondary-700/50 p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-secondary-100">
                  Performance Evaluation
                </h1>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Track and manage employee performance assessments and reviews.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{evaluations.filter(e => e.status === 'Completed').length} Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{evaluations.filter(e => e.status === 'In Review').length} In Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{evaluations.length} Total Evaluations</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <ExcelExportButton
              data={evaluations}
              filename="performance_evaluations"
              sheetName="تقييم الأداء"
              columns={[
                { key: 'employee_name', header: 'اسم الموظف' },
                { key: 'employee_position', header: 'المنصب' },
                { key: 'period', header: 'الفترة' },
                { key: 'evaluation_date', header: 'تاريخ التقييم' },
                { key: 'rating', header: 'التقييم' },
                { key: 'goals_achieved', header: 'نسبة تحقيق الأهداف (%)' },
                { key: 'status', header: 'الحالة' },
                { key: 'comments', header: 'التعليقات' }
              ]}
              buttonText="Export to Excel"
              className="btn-secondary flex items-center gap-2"
            />
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* Evaluations Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-warning-600" />
                Performance Evaluations
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Showing {evaluations.length} performance evaluations
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
                placeholder="Search evaluations by employee name or position..."
                className="input pl-10 w-full"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
                All Evaluations
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                Completed
              </button>
              <button className="px-4 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors">
                In Review
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">Employee</th>
                <th className="text-left">Period</th>
                <th className="text-left">Evaluation Date</th>
                <th className="text-left">Rating</th>
                <th className="text-left">Goals Achieved</th>
                <th className="text-left">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                          No evaluations found
                        </h3>
                        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                          Get started by creating your first performance evaluation
                        </p>
                      </div>
                      <button className="btn-primary mt-2 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add First Evaluation
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-700/50 transition-colors duration-200">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl flex items-center justify-center shadow-sm">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">{evaluation.employee_name}</div>
                          <div className="text-sm text-secondary-500 dark:text-secondary-400">{evaluation.employee_position}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {evaluation.period}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-secondary-900 dark:text-secondary-100">
                        {new Date(evaluation.evaluation_date).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg text-warning-600">{evaluation.rating}</span>
                          <span className="text-warning-500">★</span>
                        </div>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">/ 5.0</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2 max-w-[80px]">
                          <div
                            className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${evaluation.goals_achieved}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100 min-w-[40px]">
                          {evaluation.goals_achieved}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        evaluation.status === 'Completed'
                          ? 'badge-success'
                          : 'badge-warning'
                      }`}>
                        {evaluation.status}
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
