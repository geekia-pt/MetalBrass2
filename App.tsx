
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import PersonnelView from './views/PersonnelView';
import ProjectsView from './views/ProjectsView';
import ProjectDetailView from './views/ProjectDetailView';
import DocumentOcrView from './views/DocumentOcrView';
import TimesheetView from './views/TimesheetView';
import WorkerAppView from './views/WorkerAppView';
import { Company } from './types';

const COMPANIES: Company[] = [
  { id: '1', name: 'Metalbras Indústria', avatar: 'MB' },
  { id: '2', name: '3DLog Transportes', avatar: '3D' },
  { id: '3', name: 'Inovacar Rental', avatar: 'IC' },
  { id: '4', name: 'Aço Forte Ltda', avatar: 'AF' },
];

const App: React.FC = () => {
  const [currentCompany, setCurrentCompany] = useState<Company>(COMPANIES[0]);
  const [isWorkerMode, setIsWorkerMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simplified auth for demo

  const toggleMode = () => setIsWorkerMode(!isWorkerMode);

  if (isWorkerMode) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950">
        <WorkerAppView onExit={toggleMode} />
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
        <Sidebar 
          companies={COMPANIES} 
          activeCompany={currentCompany} 
          onCompanyChange={setCurrentCompany}
          onSwitchToWorker={toggleMode}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="h-1 w-full bg-industrial transition-colors" />
          
          <div className="flex-1 overflow-auto p-6 md:p-8 no-scrollbar">
            <Routes>
              <Route path="/" element={<DashboardView company={currentCompany} />} />
              <Route path="/personnel" element={<PersonnelView />} />
              <Route path="/projects" element={<ProjectsView />} />
              <Route path="/projects/:id" element={<ProjectDetailView />} />
              <Route path="/documents" element={<DocumentOcrView />} />
              <Route path="/timesheet" element={<TimesheetView />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <div id="toast-container" className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" />
      </div>
    </Router>
  );
};

export default App;
