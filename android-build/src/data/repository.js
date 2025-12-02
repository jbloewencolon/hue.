// No imports needed

export const DB_KEY = 'hue_journal_v6';
export const SETTINGS_KEY = 'hue_settings_v1';

export const DEFAULT_SETTINGS = {
    showTranscripts: true,
    enableVoice: true,
    autoDeleteDays: null, // null, 30, 90, 180
    highContrast: false,
    reduceMotion: false,
    reminderTime: null
};

export const Repository = {
  async getAll() { const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : []; },
  async getLastEntry() { const entries = await this.getAll(); return entries.length > 0 ? entries[0] : null; },
  async save(entry) {
    const entries = await this.getAll();
    const cleanEntry = { ...entry, transcript: entry.transcript || '' };
    localStorage.setItem(DB_KEY, JSON.stringify([cleanEntry, ...entries]));
    return true;
  },
  async update(id, text) {
    const entries = await this.getAll();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
        entries[idx].transcript = text;
        localStorage.setItem(DB_KEY, JSON.stringify(entries));
        return true;
    }
    return false;
  },
  async delete(id) {
    const entries = await this.getAll();
    localStorage.setItem(DB_KEY, JSON.stringify(entries.filter((e) => e.id !== id)));
    return true;
  },
  async clear() { localStorage.removeItem(DB_KEY); return true; },
  async pruneOldEntries(days) {
      if (!days) return 0;
      const entries = await this.getAll();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const keep = entries.filter(e => new Date(e.timestamp) >= cutoff);
      const removedCount = entries.length - keep.length;
      if (removedCount > 0) localStorage.setItem(DB_KEY, JSON.stringify(keep));
      return removedCount;
  }
};
