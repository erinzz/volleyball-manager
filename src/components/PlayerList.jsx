import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';

export function PlayerList({ onEditPlayer }) {
  const { state, dispatch } = useApp();
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedPlayers = useMemo(() => {
    const players = [...state.players];
    
    players.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (sortBy === 'skillLevel') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return players;
  }, [state.players, sortBy, sortOrder]);

  const handleDelete = (playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      dispatch({ type: ACTIONS.DELETE_PLAYER, payload: playerId });
    }
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

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (state.players.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No players added yet. Add your first player to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Players ({state.players.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="skillLevel">Skill Level</SelectItem>
                <SelectItem value="position">Position</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort(sortBy)}
              className="flex items-center space-x-1"
            >
              <ArrowUpDown size={16} />
              <span>{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold">{player.name}</h3>
                  <Badge className={getSkillLevelColor(player.skillLevel)}>
                    Level {player.skillLevel} - {getSkillLevelText(player.skillLevel)}
                  </Badge>
                  {player.position && (
                    <Badge variant="outline">
                      {player.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {player.email && <span>{player.email}</span>}
                  {player.email && player.phone && <span> • </span>}
                  {player.phone && <span>{player.phone}</span>}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditPlayer(player)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(player.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

