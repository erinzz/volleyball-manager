import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  players: [],
  teams: [],
  tournaments: [],
  courts: [],
  currentView: 'players'
};

// Action types
export const ACTIONS = {
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  ADD_PLAYER: 'ADD_PLAYER',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  DELETE_PLAYER: 'DELETE_PLAYER',
  ADD_TEAM: 'ADD_TEAM',
  UPDATE_TEAM: 'UPDATE_TEAM',
  DELETE_TEAM: 'DELETE_TEAM',
  ADD_TOURNAMENT: 'ADD_TOURNAMENT',
  UPDATE_TOURNAMENT: 'UPDATE_TOURNAMENT',
  DELETE_TOURNAMENT: 'DELETE_TOURNAMENT',
  ADD_COURT: 'ADD_COURT',
  UPDATE_COURT: 'UPDATE_COURT',
  DELETE_COURT: 'DELETE_COURT',
  LOAD_DATA: 'LOAD_DATA'
};

// Reducer function
function appReducer(state, action) {
  console.log(state, action)
  // depending on action triggered from frontend, action.type payload will initiate different tasks. ACTION object will export with updated state and payload

  switch (action.type) {
    case ACTIONS.SET_CURRENT_VIEW:
      // updates payload of the currentview category
      return { ...state, currentView: action.payload };
    
    case ACTIONS.ADD_PLAYER:
      return { ...state, players: [...state.players, action.payload] };
    
    case ACTIONS.UPDATE_PLAYER:
      return {
        ...state,
        // replaces current state with new state and if a player has been added/exists, unload all player information otherwise keep the same 
        // makes sense cuz function is to update players 
        players: state.players.map(player =>
          player.id === action.payload.id ? action.payload : player
        )
      };
    
    case ACTIONS.DELETE_PLAYER:
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.payload)
      };
    
    case ACTIONS.ADD_TEAM:
      return { ...state, teams: [...state.teams, action.payload] };
    
    case ACTIONS.UPDATE_TEAM:
      return {
        ...state,
        teams: state.teams.map(team =>
          team.id === action.payload.id ? action.payload : team
        )
      };
    
    case ACTIONS.DELETE_TEAM:
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload)
      };
    
    case ACTIONS.ADD_TOURNAMENT:
      return { ...state, tournaments: [...state.tournaments, action.payload] };
    
    case ACTIONS.UPDATE_TOURNAMENT:
      return {
        ...state,
        tournaments: state.tournaments.map(tournament =>
          tournament.id === action.payload.id ? action.payload : tournament
        )
      };
    
    case ACTIONS.DELETE_TOURNAMENT:
      return {
        ...state,
        tournaments: state.tournaments.filter(tournament => tournament.id !== action.payload)
      };
    
    case ACTIONS.ADD_COURT:
      return { ...state, courts: [...state.courts, action.payload] };
    
    case ACTIONS.UPDATE_COURT:
      return {
        ...state,
        courts: state.courts.map(court =>
          court.id === action.payload.id ? action.payload : court
        )
      };
    
    case ACTIONS.DELETE_COURT:
      return {
        ...state,
        courts: state.courts.filter(court => court.id !== action.payload)
      };
    
    case ACTIONS.LOAD_DATA:
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('volleyball-tournament-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  console.log("Appcontext", AppContext.Provider)
  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      players: state.players,
      teams: state.teams,
      tournaments: state.tournaments,
      courts: state.courts
    };
    localStorage.setItem('volleyball-tournament-data', JSON.stringify(dataToSave));
  }, [state.players, state.teams, state.tournaments, state.courts]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  console.log("context", context)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

