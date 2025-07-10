import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { TeamForm } from './TeamForm';
import { TeamList } from './TeamList';
import { Plus, UserCheck } from 'lucide-react';

export function TeamsView() {
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const handleCreateTeam = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const handleEditTeam = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Teams Management</h1>
        </div>
        <Button onClick={handleCreateTeam} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Team</span>
        </Button>
      </div>

      {/* Team Form */}
      {showForm && (
        <TeamForm
          team={editingTeam}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Team List */}
      <TeamList onEditTeam={handleEditTeam} />
    </div>
  );
}

