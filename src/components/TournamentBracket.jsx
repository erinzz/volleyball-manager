import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Trophy, Users, Edit } from 'lucide-react';

export function TournamentBracket({ tournament }) {
  const { dispatch } = useApp();
  const [editingMatch, setEditingMatch] = useState(null);
  const [scores, setScores] = useState({ score1: '', score2: '' });

  const updateMatchResult = (matchId, team1Score, team2Score, winner) => {
    const updatedBracket = tournament.bracket.map(round =>
      round.map(match => {
        if (match.id === matchId) {
          return {
            ...match,
            score1: parseInt(team1Score) || 0,
            score2: parseInt(team2Score) || 0,
            winner: winner
          };
        }
        return match;
      })
    );

    // Update subsequent matches with winners
    const updatedBracketWithWinners = propagateWinners(updatedBracket);

    const updatedTournament = {
      ...tournament,
      bracket: updatedBracketWithWinners
    };

    dispatch({ type: ACTIONS.UPDATE_TOURNAMENT, payload: updatedTournament });
    setEditingMatch(null);
    setScores({ score1: '', score2: '' });
  };

  const propagateWinners = (bracket) => {
    const flatMatches = bracket.flat();
    
    return bracket.map((round, roundIndex) => {
      if (roundIndex === 0) return round; // First round doesn't need winner propagation
      
      return round.map(match => {
        if (match.previousMatches) {
          const prevMatch1 = flatMatches.find(m => m.id === match.previousMatches[0]);
          const prevMatch2 = flatMatches.find(m => m.id === match.previousMatches[1]);
          
          return {
            ...match,
            team1: prevMatch1?.winner || null,
            team2: prevMatch2?.winner || null
          };
        }
        return match;
      });
    });
  };

  const handleScoreSubmit = (match) => {
    const score1 = parseInt(scores.score1) || 0;
    const score2 = parseInt(scores.score2) || 0;
    
    if (score1 === score2) {
      alert('Scores cannot be tied. Please enter different scores.');
      return;
    }
    
    const winner = score1 > score2 ? match.team1 : match.team2;
    updateMatchResult(match.id, score1, score2, winner);
  };

  const startEditingMatch = (match) => {
    setEditingMatch(match.id);
    setScores({
      score1: match.score1?.toString() || '',
      score2: match.score2?.toString() || ''
    });
  };

  const getRoundName = (roundIndex, totalRounds) => {
    if (totalRounds === 1) return 'Final';
    if (roundIndex === totalRounds - 1) return 'Final';
    if (roundIndex === totalRounds - 2) return 'Semi-Final';
    if (roundIndex === totalRounds - 3) return 'Quarter-Final';
    return `Round ${roundIndex + 1}`;
  };

  const getMatchStatus = (match) => {
    if (match.winner) return 'completed';
    if (match.team1 && match.team2) return 'ready';
    return 'waiting';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!tournament.bracket || tournament.bracket.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No bracket generated for this tournament.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>{tournament.name} - Bracket</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {tournament.bracket.map((round, roundIndex) => (
              <div key={roundIndex} className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  {getRoundName(roundIndex, tournament.bracket.length)}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {round.map((match) => {
                    const status = getMatchStatus(match);
                    const isEditing = editingMatch === match.id;
                    
                    return (
                      <Card key={match.id} className="relative">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Badge className={getStatusColor(status)}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                            {status === 'ready' && !isEditing && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditingMatch(match)}
                              >
                                <Edit size={14} />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Team 1 */}
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <Users size={16} />
                              <span className={match.winner?.id === match.team1?.id ? 'font-bold' : ''}>
                                {match.team1?.name || 'TBD'}
                              </span>
                            </div>
                            {match.score1 !== null && (
                              <span className="font-mono text-lg">{match.score1}</span>
                            )}
                          </div>
                          
                          {/* VS */}
                          <div className="text-center text-sm text-muted-foreground">VS</div>
                          
                          {/* Team 2 */}
                          <div className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <Users size={16} />
                              <span className={match.winner?.id === match.team2?.id ? 'font-bold' : ''}>
                                {match.team2?.name || 'TBD'}
                              </span>
                            </div>
                            {match.score2 !== null && (
                              <span className="font-mono text-lg">{match.score2}</span>
                            )}
                          </div>
                          
                          {/* Score input for editing */}
                          {isEditing && (
                            <div className="space-y-2 pt-2 border-t">
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  type="number"
                                  placeholder="Score 1"
                                  value={scores.score1}
                                  onChange={(e) => setScores(prev => ({ ...prev, score1: e.target.value }))}
                                />
                                <Input
                                  type="number"
                                  placeholder="Score 2"
                                  value={scores.score2}
                                  onChange={(e) => setScores(prev => ({ ...prev, score2: e.target.value }))}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleScoreSubmit(match)}
                                  disabled={!scores.score1 || !scores.score2}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingMatch(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Winner display */}
                          {match.winner && (
                            <div className="text-center pt-2 border-t">
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Winner: {match.winner.name}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

