import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getSavedHooks, saveHook, removeHook, getDailyCount, incrementDailyCount, resetDailyCount, isGuestUsed, markGuestUsed, clearGuestFlag, GUEST_LIMIT, FREE_DAILY_LIMIT } from '../utils/storage.js';
import { supabase, isSupabaseReady } from '../lib/supabase.js';

const AppContext = createContext(null);

const initialState = {
  savedHooks: [],
  dailyCount: 0,
  guestUsed: false,
  theme: 'dark',
  toast: null,
  showLoginPrompt: false,
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
    case 'SET_GUEST_USED':
      return { ...state, guestUsed: action.payload };
    case 'SHOW_LOGIN_PROMPT':
      return { ...state, showLoginPrompt: action.payload };
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
    dispatch({ type: 'SET_GUEST_USED', payload: isGuestUsed() });
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

  const showToast = useCallback((message) => {
    dispatch({ type: 'SHOW_TOAST', payload: message });
  }, []);

  const showLoginPrompt = useCallback(() => {
    dispatch({ type: 'SHOW_LOGIN_PROMPT', payload: true });
  }, []);

  const hideLoginPrompt = useCallback(() => {
    dispatch({ type: 'SHOW_LOGIN_PROMPT', payload: false });
  }, []);

  const generate = useCallback(() => {
    const newCount = incrementDailyCount();
    dispatch({ type: 'SET_DAILY_COUNT', payload: newCount });
  }, []);

  const generateGuest = useCallback(() => {
    markGuestUsed();
    dispatch({ type: 'SET_GUEST_USED', payload: true });
  }, []);

  return (
    <AppContext value={{
      ...state,
      DAILY_LIMIT: FREE_DAILY_LIMIT,
      GUEST_LIMIT,
      toggleSaveHook,
      isHookSaved,
      generate,
      generateGuest,
      showToast,
      showLoginPrompt,
      hideLoginPrompt,
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
