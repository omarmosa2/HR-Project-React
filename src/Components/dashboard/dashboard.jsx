import React, { useState } from "react";
import {
  Users, Clock, DollarSign, TrendingUp, Calendar, Award,
  Building, UserCheck, AlertCircle, RefreshCw
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import StatCard from "../common/StatCard";
import AnimatedCard from "../common/AnimatedCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { isDarkMode } = useTheme();

  const dashboardData = {
    stats: {
      totalEmployees: 120,
      presentToday: 105,
      monthlyPayroll: 83000,
      performanceScore: 91,
      totalDepartments: 5,
      pendingLeaves: 3,
    },
    weeklyAttendance: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      present: [100, 105, 98, 110, 102, 95, 90],
      absent: [20, 15, 22, 10, 18, 25, 30],
    },
    departmentStats: [
      { name: "HR", employee_count: 15 },
      { name: "IT", employee_count: 40 },
      { name: "Sales", employee_count: 25 },
      { name: "Marketing", employee_count: 20 },
      { name: "Support", employee_count: 20 },
    ],
    recentActivities: [
      {
        description: "Ahmed marked attendance",
        created_at: new Date().toISOString(),
        type: "success",
        user: "HR Admin"
      },
      {
        description: "Payroll for August processed",
        created_at: new Date().toISOString(),
        type: "info",
        user: "Finance Bot"
      },
    ],
    leaveStats: {
      approved: 10,
      pending: 3,
      rejected: 1,
    },
  };

  const refreshData = () => {
    setLastUpdated(new Date());
  };

  const weeklyAttendanceData = {
    labels: dashboardData.weeklyAttendance.labels,
    datasets: [
      {
        label: "Present",
        data: dashboardData.weeklyAttendance.present,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Absent",
        data: dashboardData.weeklyAttendance.absent,
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const departmentData = {
    labels: dashboardData.departmentStats.map(dept => dept.name),
    datasets: [
      {
        data: dashboardData.departmentStats.map(dept => dept.employee_count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const leaveStatusData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          dashboardData.leaveStats.approved,
          dashboardData.leaveStats.pending,
          dashboardData.leaveStats.rejected
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          },
          color: isDarkMode ? '#e2e8f0' : '#334155'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        grid: {
          color: isDarkMode ? '#475569' : '#e2e8f0'
        },
        ticks: {
          color: isDarkMode ? '#cbd5e1' : '#64748b'
        }
      },
      x: {
        stacked: true,
        grid: {
          color: isDarkMode ? '#475569' : '#e2e8f0'
        },
        ticks: {
          color: isDarkMode ? '#cbd5e1' : '#64748b'
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11
          },
          color: isDarkMode ? '#e2e8f0' : '#334155'
        }
      },
    }
  };

  return (
    <div className="p-6 space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="bg-gradient-primary rounded-xl p-8 text-white shadow-large animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Welcome to HR Dashboard! 🎉
            </h1>
            <p className="text-primary-100 text-lg">
              Here's your team overview for today, {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-primary-100">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={refreshData}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-200 backdrop-blur-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-6 h-6 text-white" />
            </button>
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Employees" value={dashboardData.stats.totalEmployees} icon={Users} />
        <StatCard title="Present Today" value={dashboardData.stats.presentToday} icon={UserCheck} />
        <StatCard title="Monthly Payroll" value={dashboardData.stats.monthlyPayroll} icon={DollarSign} prefix="$" />
        <StatCard title="Departments" value={dashboardData.stats.totalDepartments} icon={Building} />
        <StatCard title="Pending Leaves" value={dashboardData.stats.pendingLeaves} icon={Calendar} />
        <StatCard title="Performance Score" value={dashboardData.stats.performanceScore} icon={Award} suffix="%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatedCard className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Weekly Attendance</h3>
          <div className="h-80">
            <Bar data={weeklyAttendanceData} options={chartOptions} />
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Department Distribution</h3>
          <div className="h-64">
            <Doughnut data={departmentData} options={doughnutOptions} />
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Leave Status</h3>
          <div className="h-64">
            <Doughnut data={leaveStatusData} options={doughnutOptions} />
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary flex items-center"><Users className="w-4 h-4 mr-2" />Add Employee</button>
            <button className="w-full btn-secondary flex items-center"><Clock className="w-4 h-4 mr-2" />Mark Attendance</button>
            <button className="w-full btn-secondary flex items-center"><DollarSign className="w-4 h-4 mr-2" />Process Payroll</button>
            <button className="w-full btn-secondary flex items-center"><Calendar className="w-4 h-4 mr-2" />Manage Leaves</button>
          </div>
        </AnimatedCard>
      </div>
      <AnimatedCard>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {dashboardData.recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-success-500' :
                activity.type === 'info' ? 'bg-primary-500' :
                activity.type === 'warning' ? 'bg-warning-500' :
                activity.type === 'error' ? 'bg-danger-500' :
                'bg-secondary-400'
              }`} />
              <div>
                <p className="text-sm text-secondary-900 dark:text-secondary-100">{activity.description}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{new Date(activity.created_at).toLocaleString()}</p>
                {activity.user && <p className="text-xs text-secondary-400 dark:text-secondary-500">by {activity.user}</p>}
              </div>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default Dashboard;