import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { CourtForm } from './CourtForm';
import { CourtList } from './CourtList';
import { Plus, MapPin } from 'lucide-react';

export function CourtsView() {
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const handleCreateCourt = () => {
    setEditingCourt(null);
    setShowForm(true);
  };

  const handleEditCourt = (court) => {
    setEditingCourt(court);
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingCourt(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCourt(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Courts Management</h1>
        </div>
        <Button onClick={handleCreateCourt} className="flex items-center space-x-2">
          <Plus size={16} />
          <span>Create Court</span>
        </Button>
      </div>

      {/* Court Form */}
      {showForm && (
        <CourtForm
          court={editingCourt}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Court List */}
      <CourtList onEditCourt={handleEditCourt} />
    </div>
  );
}

