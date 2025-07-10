import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { PlayerForm } from './PlayerForm';
import { PlayerList } from './PlayerList';
import { Plus, Users } from 'lucide-react';

export function PlayersView() {
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Players Management</h1>
        </div>
        <Button onClick={handleAddPlayer} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Player</span>
        </Button>
      </div>

      {/* Player Form */}
      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Player List */}
      <PlayerList onEditPlayer={handleEditPlayer} />
    </div>
  );
}

