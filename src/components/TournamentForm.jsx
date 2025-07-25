import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { X, Users } from 'lucide-react';

export function TournamentForm({ tournament, onCancel, onSave }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    teams: [],
    format: 'single-elimination',
    status: 'setup'
  });

  useEffect(() => {
    if (tournament) {
      setFormData(tournament);
    }
  }, [tournament]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Tournament name is required');
      return;
    }

    if (formData.teams.length < 2) {
      alert('At least 2 teams are required for a tournament');
      return;
    }

    const tournamentData = {
      ...formData,
      id: tournament ? tournament.id : Date.now().toString(),
      bracket: generateBracket(formData.teams),
      createdAt: tournament ? tournament.createdAt : new Date().toISOString()
    };

    if (tournament) {
      dispatch({ type: ACTIONS.UPDATE_TOURNAMENT, payload: tournamentData });
    } else {
      dispatch({ type: ACTIONS.ADD_TOURNAMENT, payload: tournamentData });
    }

    onSave && onSave();
    
    // Reset form if adding new tournament
    if (!tournament) {
      setFormData({
        name: '',
        teams: [],
        format: 'single-elimination',
        status: 'setup'
      });
    }
  };

  const generateBracket = (teams) => {
    // Simple single-elimination bracket generation
    const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    const rounds = [];
    let currentRound = shuffledTeams.map((team, index) => ({
      id: `match-${Date.now()}-${index}`,
      team1: index % 2 === 0 ? team : null,
      team2: index % 2 === 1 ? shuffledTeams[index - 1] : null,
      winner: null,
      score1: null,
      score2: null,
      round: 1
    })).filter(match => match.team1 && match.team2);

    rounds.push(currentRound);

    // Generate subsequent rounds
    let roundNumber = 2;
    while (currentRound.length > 1) {
      const nextRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        if (i + 1 < currentRound.length) {
          nextRound.push({
            id: `match-${Date.now()}-${roundNumber}-${i}`,
            team1: null, // Will be filled by winners
            team2: null,
            winner: null,
            score1: null,
            score2: null,
            round: roundNumber,
            previousMatches: [currentRound[i].id, currentRound[i + 1].id]
          });
        }
      }
      if (nextRound.length > 0) {
        rounds.push(nextRound);
        currentRound = nextRound;
        roundNumber++;
      } else {
        break;
      }
    }

    return rounds;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTeamToTournament = (team) => {
    if (!formData.teams.find(t => t.id === team.id)) {
      setFormData(prev => ({
        ...prev,
        teams: [...prev.teams, team]
      }));
    }
  };

  const removeTeamFromTournament = (teamId) => {
    setFormData(prev => ({
      ...prev,
      teams: prev.teams.filter(t => t.id !== teamId)
    }));
  };

  const getAvailableTeams = () => {
    const tournamentTeamIds = formData.teams.map(t => t.id);
    return state.teams.filter(team => !tournamentTeamIds.includes(team.id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tournament ? 'Edit Tournament' : 'Create New Tournament'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tournamentName">Tournament Name *</Label>
              <Input
                id="tournamentName"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter tournament name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <select 
                value={formData.format} 
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="single-elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tournament Teams ({formData.teams.length})</Label>
            
            {/* Current tournament teams */}
            {formData.teams.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Participating Teams:</h4>
                <div className="space-y-2">
                  {formData.teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Users size={16} />
                        <span className="font-medium">{team.name}</span>
                        <Badge variant="outline">
                          {team.players.length} players
                        </Badge>
                        {team.players.length > 0 && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Avg: {(team.players.reduce((sum, p) => sum + p.skillLevel, 0) / team.players.length).toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTeamFromTournament(team.id)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available teams to add */}
            {getAvailableTeams().length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Available Teams:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getAvailableTeams().map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <Users size={16} />
                        <span className="font-medium">{team.name}</span>
                        <Badge variant="outline">
                          {team.players.length} players
                        </Badge>
                        {team.players.length > 0 && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Avg: {(team.players.reduce((sum, p) => sum + p.skillLevel, 0) / team.players.length).toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTeamToTournament(team)}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {getAvailableTeams().length === 0 && state.teams.length > 0 && (
              <p className="text-sm text-muted-foreground">
                All available teams have been added to this tournament.
              </p>
            )}

            {state.teams.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No teams available. Create some teams first to organize tournaments.
              </p>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={formData.teams.length < 2}>
              {tournament ? 'Update Tournament' : 'Create Tournament'}
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

