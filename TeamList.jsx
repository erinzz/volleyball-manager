import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Edit, Trash2, Users } from 'lucide-react';

export function TeamList({ onEditTeam }) {
  const { state, dispatch } = useApp();

  const handleDelete = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      dispatch({ type: ACTIONS.DELETE_TEAM, payload: teamId });
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

  const getTeamAverageSkill = (team) => {
    if (team.players.length === 0) return 0;
    const total = team.players.reduce((sum, player) => sum + player.skillLevel, 0);
    return (total / team.players.length).toFixed(1);
  };

  if (state.teams.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No teams created yet. Create your first team to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {state.teams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <CardTitle className="flex items-center space-x-2">
                  <Users size={20} />
                  <span>{team.name}</span>
                </CardTitle>
                <Badge variant="outline">
                  {team.players.length} players
                </Badge>
                {team.players.length > 0 && (
                  <Badge className="bg-purple-100 text-purple-800">
                    Avg Skill: {getTeamAverageSkill(team)}
                  </Badge>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTeam(team)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(team.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {team.players.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Team Members:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{player.name}</span>
                          <Badge className={getSkillLevelColor(player.skillLevel)} size="sm">
                            L{player.skillLevel}
                          </Badge>
                        </div>
                        {player.position && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {player.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p>No players assigned to this team yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

