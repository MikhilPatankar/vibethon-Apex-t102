const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('elixa_token');
  }
  return null;
}

export function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('elixa_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('elixa_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getMe: () => request('/api/auth/me'),

  // Modules
  getModules: () => request('/api/modules'),
  getModule: (id) => request(`/api/modules/${id}`),

  // Lessons
  getLesson: (id) => request(`/api/lessons/${id}`),
  completeLesson: (id) => request(`/api/lessons/${id}/complete`, { method: 'POST', body: '{}' }),

  // Quiz
  getQuiz: (id) => request(`/api/quiz/${id}`),
  submitQuiz: (body) => request('/api/quiz/submit', { method: 'POST', body: JSON.stringify(body) }),

  // Games
  saveGameScore: (body) => request('/api/games/score', { method: 'POST', body: JSON.stringify(body) }),

  // Simulations
  completeSimulation: (body) => request('/api/simulations/complete', { method: 'POST', body: JSON.stringify(body) }),

  // Progress
  getProgress: () => request('/api/progress'),

  // Leaderboard
  getLeaderboard: () => request('/api/leaderboard'),

  // Achievements
  getAchievements: () => request('/api/achievements'),
};
