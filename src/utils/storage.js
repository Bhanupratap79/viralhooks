const SAVED_HOOKS_KEY = 'viralhooks_saved';
const DAILY_COUNT_KEY = 'viralhooks_daily';
const DAILY_DATE_KEY = 'viralhooks_date';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getSavedHooks() {
  try {
    const data = localStorage.getItem(SAVED_HOOKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHook(hook) {
  try {
    const saved = getSavedHooks();
    if (!saved.some(h => h.id === hook.id)) {
      saved.unshift({ ...hook, savedAt: Date.now() });
      localStorage.setItem(SAVED_HOOKS_KEY, JSON.stringify(saved));
    }
    return saved;
  } catch {
    return getSavedHooks();
  }
}

export function removeHook(hookId) {
  try {
    const saved = getSavedHooks().filter(h => h.id !== hookId);
    localStorage.setItem(SAVED_HOOKS_KEY, JSON.stringify(saved));
    return saved;
  } catch {
    return getSavedHooks();
  }
}

export function getDailyCount() {
  try {
    const storedDate = localStorage.getItem(DAILY_DATE_KEY);
    const today = getToday();
    if (storedDate !== today) {
      localStorage.setItem(DAILY_DATE_KEY, today);
      localStorage.setItem(DAILY_COUNT_KEY, '0');
      return 0;
    }
    return parseInt(localStorage.getItem(DAILY_COUNT_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function incrementDailyCount() {
  try {
    const today = getToday();
    localStorage.setItem(DAILY_DATE_KEY, today);
    const count = getDailyCount() + 1;
    localStorage.setItem(DAILY_COUNT_KEY, count.toString());
    return count;
  } catch {
    return 0;
  }
}

export const DAILY_LIMIT = 5;
export const PREMIUM_DAILY_LIMIT = 999;
