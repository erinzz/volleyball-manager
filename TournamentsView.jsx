import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { TournamentForm } from './TournamentForm';
import { TournamentList } from './TournamentList';
import { TournamentBracket } from './TournamentBracket';
import { Plus, Trophy, ArrowLeft } from 'lucide-react';

export function TournamentsView() {
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [viewingBracket, setViewingBracket] = useState(null);

  const handleCreateTournament = () => {
    setEditingTournament(null);
    setShowForm(true);
    setViewingBracket(null);
  };

  const handleEditTournament = (tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
    setViewingBracket(null);
  };

  const handleViewBracket = (tournament) => {
    setViewingBracket(tournament);
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleBackToList = () => {
    setViewingBracket(null);
    setShowForm(false);
    setEditingTournament(null);
  };

  // If viewing a bracket, show the bracket view
  if (viewingBracket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToList} className="flex items-center space-x-2">
            <ArrowLeft size={16} />
            <span>Back to Tournaments</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Tournament Bracket</h1>
          </div>
        </div>
        <TournamentBracket tournament={viewingBracket} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Tournaments Management</h1>
        </div>
        <Button onClick={handleCreateTournament} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Tournament</span>
        </Button>
      </div>

      {/* Tournament Form */}
      {showForm && (
        <TournamentForm
          tournament={editingTournament}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Tournament List */}
      <TournamentList 
        onEditTournament={handleEditTournament}
        onViewBracket={handleViewBracket}
      />
    </div>
  );
}

