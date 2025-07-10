import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';

export function PlayerForm({ player, onCancel, onSave }) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    skillLevel: 1,
    position: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (player) {
      setFormData(player);
    }
  }, [player]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Player name is required');
      return;
    }

    const playerData = {
      ...formData,
      id: player ? player.id : Date.now().toString(),
      skillLevel: parseInt(formData.skillLevel)
    };

    if (player) {
      dispatch({ type: ACTIONS.UPDATE_PLAYER, payload: playerData });
    } else {
      dispatch({ type: ACTIONS.ADD_PLAYER, payload: playerData });
    }

    onSave && onSave();
    
    // Reset form if adding new player
    if (!player) {
      setFormData({
        name: '',
        skillLevel: 1,
        position: '',
        email: '',
        phone: ''
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
        <CardTitle>{player ? 'Edit Player' : 'Add New Player'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter player name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level *</Label>
              <select 
                value={formData.skillLevel} 
                onChange={(e) => handleChange('skillLevel', parseInt(e.target.value))}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value={1}>1 - Beginner</option>
                <option value={2}>2 - Novice</option>
                <option value={3}>3 - Intermediate</option>
                <option value={4}>4 - Advanced</option>
                <option value={5}>5 - Expert</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Preferred Position</Label>
              <select 
                value={formData.position} 
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">Any Position</option>
                <option value="setter">Setter</option>
                <option value="outside-hitter">Outside Hitter</option>
                <option value="middle-blocker">Middle Blocker</option>
                <option value="opposite">Opposite</option>
                <option value="libero">Libero</option>
                <option value="defensive-specialist">Defensive Specialist</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit">
              {player ? 'Update Player' : 'Add Player'}
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

