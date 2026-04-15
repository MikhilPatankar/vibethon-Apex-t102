function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function getXpForNextLevel(xp) {
  const level = getLevel(xp);
  return level * 100;
}

function getXpProgress(xp) {
  const level = getLevel(xp);
  const levelStart = (level - 1) * 100;
  const levelEnd = level * 100;
  return {
    current: xp - levelStart,
    required: levelEnd - levelStart,
    percentage: ((xp - levelStart) / (levelEnd - levelStart)) * 100,
  };
}

function updateStreak(lastActiveDate, currentStreak) {
  const today = new Date().toISOString().split('T')[0];
  if (!lastActiveDate) return { streak: 1, lastActiveDate: today };
  if (lastActiveDate === today) return { streak: currentStreak, lastActiveDate: today };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActiveDate === yesterdayStr) {
    return { streak: currentStreak + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

module.exports = { getLevel, getXpForNextLevel, getXpProgress, updateStreak };
