import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useApp, ACTIONS } from '../contexts/AppContext';
import { Edit, Trash2, MapPin, Activity } from 'lucide-react';

export function CourtList({ onEditCourt }) {
  const { state, dispatch } = useApp();

  const handleDelete = (courtId) => {
    if (window.confirm('Are you sure you want to delete this court?')) {
      dispatch({ type: ACTIONS.DELETE_COURT, payload: courtId });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurfaceColor = (surface) => {
    switch (surface) {
      case 'indoor': return 'bg-blue-100 text-blue-800';
      case 'outdoor': return 'bg-green-100 text-green-800';
      case 'sand': return 'bg-yellow-100 text-yellow-800';
      case 'grass': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  const formatSurface = (surface) => {
    return surface.charAt(0).toUpperCase() + surface.slice(1);
  };

  if (state.courts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <p>No courts created yet. Create your first court to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.courts.map((court) => (
        <Card key={court.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="flex items-center space-x-2">
                  <Activity size={20} />
                  <span>{court.name}</span>
                </CardTitle>
                {court.location && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    <span>{court.location}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditCourt(court)}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(court.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(court.status)}>
                  {formatStatus(court.status)}
                </Badge>
                <Badge className={getSurfaceColor(court.surface)} variant="outline">
                  {formatSurface(court.surface)}
                </Badge>
              </div>
              
              {/* Court assignment info */}
              <div className="text-sm text-muted-foreground">
                <div>Surface: {formatSurface(court.surface)}</div>
                <div>Status: {formatStatus(court.status)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

