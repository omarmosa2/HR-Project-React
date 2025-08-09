import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
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
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Performance Evaluation</h1>
        <p className="text-gray-600">Track and manage employee performance</p>
      </div>

      {/* Header Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold">Employee Evaluations</h2>
            <p className="text-sm text-gray-500">Review and manage performance assessments</p>
          </div>
          <div className="flex gap-2">
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
              buttonText="تصدير إلى Excel"
            />
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
              <Plus className="w-4 h-4" />
              Add Evaluation
            </button>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mb-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-1 rounded-md bg-white text-sm font-medium shadow">All Evaluations</button>
            <button className="px-4 py-1 rounded-md text-sm text-gray-600">Recent</button>
            <button className="px-4 py-1 rounded-md text-sm text-gray-600">Drafts</button>
          </div>

          {/* Search */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search employee..."
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
                <th className="py-2">Employee</th>
                <th className="py-2">Period</th>
                <th className="py-2">Evaluation Date</th>
                <th className="py-2">Rating</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {evaluations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No performance evaluations found.
                  </td>
                </tr>
              ) : (
                evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="font-medium">{evaluation.employee_name}</div>
                      <div className="text-xs text-gray-500">{evaluation.employee_position}</div>
                    </td>
                    <td className="py-3">{evaluation.period}</td>
                    <td className="py-3">{new Date(evaluation.evaluation_date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{evaluation.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        evaluation.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {evaluation.status}
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
