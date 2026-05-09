/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Personnel from './components/Personnel';
import Planning from './components/Planning';
import SettingsPage from './components/Settings';
import TeacherPortal from './components/TeacherPortal';
import { INITIAL_REQUESTS, INITIAL_PERSONNEL, DEFAULT_SETTINGS } from './data/mockData';
import { ICTRequest, PersonnelNotification, Settings, School, UserRole } from './types';
import { motion, AnimatePresence } from 'motion/react';

import Accounts from './components/Accounts';

interface User {
  role: UserRole;
  school: School | 'Centraal' | '';
}

export default function App() {
  const [user, setUser] = useState<User>({ role: 'leerkracht', school: '' });
  const [activeTab, setActiveTab] = useState('teacher-view');
  const [requests, setRequests] = useState<ICTRequest[]>(INITIAL_REQUESTS);
  const [personnel, setPersonnel] = useState<PersonnelNotification[]>(INITIAL_PERSONNEL);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const updateRequest = (id: string, updates: Partial<ICTRequest>) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addRequest = (request: Omit<ICTRequest, 'id'>) => {
    const newRequest: ICTRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
    } as ICTRequest;
    setRequests(prev => [newRequest, ...prev]);
  };

  const updatePersonnel = (id: string, updates: Partial<PersonnelNotification>) => {
    setPersonnel(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addPersonnelNotification = (notification: Omit<PersonnelNotification, 'id'>) => {
    const newNotification: PersonnelNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
    } as PersonnelNotification;
    setPersonnel(prev => [newNotification, ...prev]);
  };

  const handleLogin = (role: UserRole, school: string) => {
    setUser({ role, school: school as School | 'Centraal' });
    if (role === 'leerkracht' || role === 'directie') {
      setActiveTab('teacher-view');
    } else {
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setUser({ role: 'leerkracht', school: '' });
    setActiveTab('teacher-view');
  };

  const renderContent = () => {
    // if (!user) return null; // Removed this because user is now initialized

    switch (activeTab) {
      case 'teacher-view':
        return (
          <div className="-m-8">
            <TeacherPortal 
              userRole={user.role}
              userSchool={user.school as School}
              schools={settings.scholen}
              categories={settings.categorieen}
              calendarEntries={settings.calendarEntries}
              addRequest={addRequest}
              addPersonnelNotification={addPersonnelNotification}
              requests={requests}
              standaardChecklistNieuw={settings.standaardChecklistNieuw}
              standaardChecklistVertrek={settings.standaardChecklistVertrek}
              logout={logout}
              goToDashboard={() => setActiveTab('dashboard')}
              onLogin={handleLogin}
            />
          </div>
        );
      case 'dashboard':
        return (
          <Dashboard 
            requests={requests} 
            updateRequest={updateRequest} 
            addRequest={addRequest}
            schools={settings.scholen}
          />
        );
      case 'personeel':
        return (
          <Personnel 
            notifications={personnel} 
            updateNotification={updatePersonnel}
            schools={settings.scholen}
          />
        );
      case 'planning':
        return (
          <Planning 
            requests={requests} 
            personnel={personnel} 
          />
        );
      case 'accounts':
        return <Accounts schools={settings.scholen} />;
      case 'settings':
        return <SettingsPage settings={settings} />;
      default:
        return <div>Pagina niet gevonden</div>;
    }
  };

  const isTeacherView = activeTab === 'teacher-view';

  return (
    <div className="min-h-screen bg-[#F6F5F0] font-sans text-[#0F172A] selection:bg-[#CFDCE2] selection:text-[#2A4652]">
      {!isTeacherView && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          userRole={user.role}
          userName={user.school === 'Centraal' ? 'ICT Beheer' : `${user.school} Management`}
          logout={logout}
        />
      )}
      
      <main className={`${!isTeacherView ? 'ml-64' : ''} p-8 min-h-screen`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`max-w-7xl mx-auto ${isTeacherView ? 'pt-8' : ''}`}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

