import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Users, UserCheck, Trophy, MapPin } from 'lucide-react';

export function Navigation() {
  const { state, dispatch } = useApp();

  const navItems = [
    { id: 'players', label: 'Players', icon: Users },
    { id: 'teams', label: 'Teams', icon: UserCheck },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'courts', label: 'Courts', icon: MapPin }
  ];

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Volleyball Tournament Manager</h1>
          <div className="flex space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={state.currentView === id ? 'default' : 'outline'}
                onClick={() => dispatch({ type: ACTIONS.SET_CURRENT_VIEW, payload: id })}
                className="flex items-center space-x-2"
              >
                <Icon size={16} />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

