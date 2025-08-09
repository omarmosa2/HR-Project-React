import React, { createContext, useContext, useState } from "react";

const HRMSContext = createContext();

export const useHRMS = () => useContext(HRMSContext);

export const HRMSProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <HRMSContext.Provider value={{ isSidebarOpen, openSidebar, closeSidebar }}>
      {children}
    </HRMSContext.Provider>
  );
};
