import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Navigation } from './components/Navigation';
import { PlayersView } from './components/PlayersView';
import { TeamsView } from './components/TeamsView';
import { TournamentsView } from './components/TournamentsView';
import { CourtsView } from './components/CourtsView';
import './App.css';

function AppContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'players':
        return <PlayersView />;
      case 'teams':
        return <TeamsView />;
      case 'tournaments':
        return <TournamentsView />;
      case 'courts':
        return <CourtsView />;
      default:
        return <PlayersView />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto p-6">
        {renderCurrentView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

