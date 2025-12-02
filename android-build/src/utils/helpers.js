/* -------------------------------------------------------------------------- */
/* 0. UTILS & POLYFILLS                                                       */
/* -------------------------------------------------------------------------- */

export const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getX = (date, startDate, endDate, width) => {
  const totalDuration = endDate - startDate;
  const elapsed = date - startDate;
  return (elapsed / totalDuration) * width;
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Morning' : 'Evening';
};