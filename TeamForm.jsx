import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { X } from 'lucide-react';

export function TeamForm({ team, onCancel, onSave }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    players: []
  });

  useEffect(() => {
    if (team) {
      setFormData(team);
    }
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Team name is required');
      return;
    }

    const teamData = {
      ...formData,
      id: team ? team.id : Date.now().toString()
    };

    if (team) {
      dispatch({ type: ACTIONS.UPDATE_TEAM, payload: teamData });
    } else {
      dispatch({ type: ACTIONS.ADD_TEAM, payload: teamData });
    }

    onSave && onSave();
    
    // Reset form if adding new team
    if (!team) {
      setFormData({
        name: '',
        players: []
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPlayerToTeam = (player) => {
    if (!formData.players.find(p => p.id === player.id)) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, player]
      }));
    }
  };

  const removePlayerFromTeam = (playerId) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== playerId)
    }));
  };

  const getAvailablePlayers = () => {
    // Get players that are not already in this team
    const teamPlayerIds = formData.players.map(p => p.id);
    return state.players.filter(player => !teamPlayerIds.includes(player.id));
  };

  const getSkillLevelText = (level) => {
    const levels = {
      1: 'Beginner',
      2: 'Novice', 
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert'
    };
    return levels[level] || 'Unknown';
  };

  const getSkillLevelColor = (level) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{team ? 'Edit Team' : 'Create New Team'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Team Players ({formData.players.length})</Label>
            
            {/* Current team players */}
            {formData.players.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Current Team Members:</h4>
                <div className="space-y-2">
                  {formData.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{player.name}</span>
                        <Badge className={getSkillLevelColor(player.skillLevel)}>
                          Level {player.skillLevel} - {getSkillLevelText(player.skillLevel)}
                        </Badge>
                        {player.position && (
                          <Badge variant="outline">
                            {player.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePlayerFromTeam(player.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available players to add */}
            {getAvailablePlayers().length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Players:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getAvailablePlayers().map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{player.name}</span>
                        <Badge className={getSkillLevelColor(player.skillLevel)}>
                          Level {player.skillLevel} - {getSkillLevelText(player.skillLevel)}
                        </Badge>
                        {player.position && (
                          <Badge variant="outline">
                            {player.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPlayerToTeam(player)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getAvailablePlayers().length === 0 && state.players.length > 0 && (
              <p className="text-sm text-muted-foreground">
                All available players have been added to this team.
              </p>
            )}

            {state.players.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No players available. Add some players first to create teams.
              </p>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit">
              {team ? 'Update Team' : 'Create Team'}
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

