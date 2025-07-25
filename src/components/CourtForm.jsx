import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';

export function CourtForm({ court, onCancel, onSave }) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    surface: 'indoor',
    status: 'available'
  });

  useEffect(() => {
    if (court) {
      setFormData(court);
    }
  }, [court]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Court name is required');
      return;
    }

    const courtData = {
      ...formData,
      id: court ? court.id : Date.now().toString()
    };

    if (court) {
      dispatch({ type: ACTIONS.UPDATE_COURT, payload: courtData });
    } else {
      dispatch({ type: ACTIONS.ADD_COURT, payload: courtData });
    }

    onSave && onSave();
    
    // Reset form if adding new court
    if (!court) {
      setFormData({
        name: '',
        location: '',
        surface: 'indoor',
        status: 'available'
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{court ? 'Edit Court' : 'Create New Court'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="courtName">Court Name *</Label>
              <Input
                id="courtName"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter court name (e.g., Court A, Main Court)"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter location (e.g., Gym 1, Building A)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surface">Surface Type</Label>
              <select 
                id="surface"
                value={formData.surface} 
                onChange={(e) => handleChange('surface', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="sand">Sand</option>
                <option value="grass">Grass</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                value={formData.status} 
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit">
              {court ? 'Update Court' : 'Create Court'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

