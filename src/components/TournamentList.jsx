import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Edit, Trash2, Trophy, Users, Calendar } from 'lucide-react';

export function TournamentList({ onEditTournament, onViewBracket }) {
  const { state, dispatch } = useApp();

  const handleDelete = (tournamentId) => {
    if (window.confirm('Are you sure you want to delete this tournament?')) {
      dispatch({ type: ACTIONS.DELETE_TOURNAMENT, payload: tournamentId });
    }
  };

  const getTournamentStatus = (tournament) => {
    if (!tournament.bracket || tournament.bracket.length === 0) return 'setup';
    
    const allMatches = tournament.bracket.flat();
    const completedMatches = allMatches.filter(match => match.winner);
    
    if (completedMatches.length === 0) return 'not-started';
    if (completedMatches.length === allMatches.length) return 'completed';
    return 'in-progress';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'setup': return 'bg-gray-100 text-gray-800';
      case 'not-started': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'setup': return 'Setup';
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getTournamentWinner = (tournament) => {
    if (!tournament.bracket || tournament.bracket.length === 0) return null;
    
    const finalRound = tournament.bracket[tournament.bracket.length - 1];
    if (finalRound.length === 1 && finalRound[0].winner) {
      return finalRound[0].winner;
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (state.tournaments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No tournaments created yet. Create your first tournament to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {state.tournaments.map((tournament) => {
        const status = getTournamentStatus(tournament);
        const winner = getTournamentWinner(tournament);
        
        return (
          <Card key={tournament.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy size={20} />
                    <span>{tournament.name}</span>
                  </CardTitle>
                  <Badge className={getStatusColor(status)}>
                    {getStatusText(status)}
                  </Badge>
                  {winner && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      🏆 {winner.name}
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  {tournament.bracket && tournament.bracket.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewBracket(tournament)}
                    >
                      View Bracket
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditTournament(tournament)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(tournament.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>Teams: {tournament.teams.length}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar size={16} />
                    <span>Created: {formatDate(tournament.createdAt)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Format: {tournament.format.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-2">Participating Teams:</h4>
                  <div className="flex flex-wrap gap-2">
                    {tournament.teams.map((team) => (
                      <Badge key={team.id} variant="outline" className="flex items-center space-x-1">
                        <Users size={12} />
                        <span>{team.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {tournament.bracket && tournament.bracket.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Tournament Progress: {tournament.bracket.flat().filter(m => m.winner).length} / {tournament.bracket.flat().length} matches completed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

