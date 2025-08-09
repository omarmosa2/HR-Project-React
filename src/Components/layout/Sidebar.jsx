import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import {
  LayoutDashboard,
  Users,
  Building,
  CalendarCheck,
  PlaneTakeoff,
  Wallet,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
  UserCircle,
  LogIn,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  Shield,
  HelpCircle,
  Moon,
  Sun
} from "lucide-react";

const menuSections = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
        badge: null,
        description: "Overview and analytics"
      }
    ]
  },
  {
    title: "Human Resources",
    items: [
      {
        label: "Employees",
        icon: Users,
        path: "/employees",
        badge: "12",
        description: "Manage employee records"
      },
      {
        label: "Departments",
        icon: Building,
        path: "/departments",
        badge: null,
        description: "Organizational structure"
      },
      {
        label: "Attendance",
        icon: CalendarCheck,
        path: "/attendance",
        badge: "3",
        description: "Track employee attendance"
      },
      {
        label: "Leave Management",
        icon: PlaneTakeoff,
        path: "/leave-management",
        badge: "5",
        description: "Manage leave requests"
      }
    ]
  },
  {
    title: "Finance & Operations",
    items: [
      {
        label: "Payroll",
        icon: Wallet,
        path: "/payroll",
        badge: null,
        description: "Salary and compensation"
      },
      {
        label: "Performance",
        icon: BarChart2,
        path: "/performance",
        badge: null,
        description: "Employee evaluations"
      }
    ]
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Jobs & Recruitment",
        icon: Briefcase,
        path: "/jobs",
        badge: "2",
        description: "Job postings and hiring"
      }
    ]
  },
  {
    title: "System",
    items: [
      {
        label: "Analytics",
        icon: BarChart2,
        path: "/chart",
        badge: null,
        description: "Reports and insights"
      },
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
        badge: null,
        description: "System configuration"
      }
    ]
  }
];

const authItems = [
  {
    label: "Sign Up",
    icon: UserPlus,
    path: "/SignUp",
    description: "Create new account"
  },
  {
    label: "Login",
    icon: LogIn,
    path: "/Login",
    description: "Access your account"
  }
];

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const filteredSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} bg-white border-r border-secondary-200 flex flex-col h-screen shadow-soft sidebar-transition relative`}>
      {/* Header Section */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-display font-bold text-secondary-900">HR System</h1>
                <p className="text-xs text-secondary-500">Management Portal</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                title="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-secondary-600" />
                ) : (
                  <Moon className="w-4 h-4 text-secondary-600" />
                )}
              </button>
              <button
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-secondary-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full text-xs flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 sidebar-nav">
        {filteredSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-3 py-2">
                <h3 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="p-1 rounded hover:bg-secondary-100 transition-colors duration-200"
                >
                  {expandedSections[section.title] ? (
                    <ChevronDown className="w-3 h-3 text-secondary-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-secondary-400" />
                  )}
                </button>
              </div>
            )}

            <div className={`space-y-1 ${!isCollapsed && !expandedSections[section.title] && section.title !== "Main" ? 'hidden' : ''}`}>
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={itemIndex}
                    to={item.path}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative nav-item ${
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 shadow-sm border-l-4 border-primary-600 nav-item-active"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    }`}
                    title={isCollapsed ? item.label : item.description}
                  >
                    <div className={`transition-colors duration-200 ${
                      isActive ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {!isCollapsed && (
                      <>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-secondary-500 mt-0.5">{item.description}</div>
                        </div>

                        {item.badge && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isActive
                              ? "bg-primary-200 text-primary-800"
                              : "bg-secondary-200 text-secondary-700"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center badge-pulse">
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && (
                      <div className="tooltip">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-secondary-200 space-y-3">
        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="quick-actions">
              <button
                className="quick-action-btn bg-secondary-50 hover:bg-secondary-100 transition-all duration-200"
                title="Help & Support"
              >
                <HelpCircle className="w-4 h-4 text-secondary-600" />
              </button>
              <button
                className="quick-action-btn bg-secondary-50 hover:bg-secondary-100 transition-all duration-200"
                title="Security Settings"
              >
                <Shield className="w-4 h-4 text-secondary-600" />
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className={`${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-150 transition-all duration-200 cursor-pointer group user-profile relative ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1">
                  <div className="font-semibold text-secondary-900 text-sm">John Doe</div>
                  <div className="text-xs text-secondary-500 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Administrator
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                  <LogOut className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200" />
                </div>
              </>
            )}

            {isCollapsed && (
              <div className="tooltip">
                <div className="font-medium">John Doe</div>
                <div className="text-xs opacity-75">Administrator</div>
              </div>
            )}
          </div>
        </div>

        {/* Auth Links */}
        {!isCollapsed && (
          <div className="space-y-1">
            <div className="text-xs font-semibold text-secondary-500 uppercase tracking-wider px-3 py-1">
              Account
            </div>
            {authItems.map((item, i) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={i}
                  to={item.path}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                  title={item.description}
                >
                  <div className={`transition-colors duration-200 ${
                    isActive ? "text-primary-600" : "text-secondary-400 group-hover:text-secondary-600"
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Collapse Toggle */}
        {onToggle && (
          <div className="pt-2 border-t border-secondary-200">
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-secondary-600" />
              ) : (
                <Menu className="w-4 h-4 text-secondary-600" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
