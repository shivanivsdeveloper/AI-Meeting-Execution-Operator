import React, { useState } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { FloatingAIAssistant } from '../ai/FloatingAIAssistant';

interface MainLayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  children: React.ReactNode;
  startInteractiveDemo: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  startInteractiveDemo
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className={`min-h-screen flex bg-[#07090e] text-slate-100 font-sans ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar
          setActiveTab={setActiveTab}
          openAIChat={() => setIsAIChatOpen(true)}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          startInteractiveDemo={startInteractiveDemo}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Persistent Floating AI Assistant */}
      <FloatingAIAssistant
        isOpen={isAIChatOpen}
        setIsOpen={setIsAIChatOpen}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
