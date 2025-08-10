import React, { useState } from 'react';
import { Bell, Search, Settings, HelpCircle, Menu, X, ChevronDown, User, LogOut, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const notifications = [
    { id: 1, title: "New employee registered", time: "2 min ago", type: "info" },
    { id: 2, title: "Payroll processed successfully", time: "1 hour ago", type: "success" },
    { id: 3, title: "Leave request pending approval", time: "3 hours ago", type: "warning" },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 🌅";
    if (hour < 17) return "Good Afternoon! ☀️";
    return "Good Evening! 🌙";
  };

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 shadow-soft sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors duration-200"
          >
            {isSidebarCollapsed ? (
              <Menu className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            ) : (
              <X className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            )}
          </button>

          {/* Welcome Section */}
          <div>
            <h1 className="text-xl lg:text-2xl font-display font-bold text-secondary-900 dark:text-secondary-100">
              {getGreeting()}
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm mt-1 hidden sm:block">
              Welcome back, here's what's happening with your team today.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {/* Mobile Search */}
            <button className="md:hidden p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-secondary-200 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-secondary-200 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200"
              title="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Settings */}
            <button className="p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-secondary-200 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:text-secondary-200 dark:hover:bg-secondary-700 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger-500 rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 z-50">
                  <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Notifications</h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">You have {notifications.length} new notifications</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 border-b border-secondary-100 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-success-500' :
                            notification.type === 'warning' ? 'bg-warning-500' :
                            'bg-primary-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{notification.title}</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-secondary-200 dark:border-secondary-700">
                    <button className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-4 border-l border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg p-2 transition-colors duration-200"
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">John Doe</div>
                <div className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Administrator
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-medium">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-400 dark:text-secondary-500 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-800 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-700 z-50">
                <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">JD</span>
                    </div>
                    <div>
                      <div className="font-semibold text-secondary-900 dark:text-secondary-100">John Doe</div>
                      <div className="text-sm text-secondary-600 dark:text-secondary-400">john.doe@company.com</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 flex items-center gap-1 mt-1">
                        <Shield className="w-3 h-3" />
                        Administrator
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors duration-200">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                    Preferences
                  </button>
                  <hr className="my-2 border-secondary-200 dark:border-secondary-700" />
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
