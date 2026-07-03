import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getSavedHooks, saveHook, removeHook, getDailyCount, incrementDailyCount, DAILY_LIMIT } from '../utils/storage.js';

const AppContext = createContext(null);

const initialState = {
  savedHooks: [],
  dailyCount: 0,
  theme: 'dark',
  isPremium: false,
  toast: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SAVED_HOOKS':
      return { ...state, savedHooks: action.payload };
    case 'TOGGLE_SAVE_HOOK': {
      const hook = action.payload;
      const exists = state.savedHooks.some(h => h.id === hook.id);
      if (exists) {
        const updated = removeHook(hook.id);
        return { ...state, savedHooks: updated };
      }
      const updated = saveHook(hook);
      return { ...state, savedHooks: updated };
    }
    case 'SET_DAILY_COUNT':
      return { ...state, dailyCount: action.payload };
    case 'INCREMENT_COUNT':
      return { ...state, dailyCount: state.dailyCount + 1 };
    case 'SET_PREMIUM':
      return { ...state, isPremium: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_SAVED_HOOKS', payload: getSavedHooks() });
    dispatch({ type: 'SET_DAILY_COUNT', payload: getDailyCount() });
  }, []);

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2500);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  const toggleSaveHook = useCallback((hook) => {
    dispatch({ type: 'TOGGLE_SAVE_HOOK', payload: hook });
  }, []);

  const isHookSaved = useCallback((hookId) => {
    return state.savedHooks.some(h => h.id === hookId);
  }, [state.savedHooks]);

  const canGenerate = state.isPremium || state.dailyCount < DAILY_LIMIT;

  const generate = useCallback(() => {
    if (!state.isPremium) {
      const newCount = incrementDailyCount();
      dispatch({ type: 'SET_DAILY_COUNT', payload: newCount });
    }
  }, [state.isPremium]);

  const showToast = useCallback((message) => {
    dispatch({ type: 'SHOW_TOAST', payload: message });
  }, []);

  return (
    <AppContext value={{
      ...state,
      DAILY_LIMIT,
      toggleSaveHook,
      isHookSaved,
      canGenerate,
      generate,
      showToast,
      dispatch,
    }}>
      {children}
    </AppContext>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
