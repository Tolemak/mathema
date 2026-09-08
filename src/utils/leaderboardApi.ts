import { LeaderboardEntry } from '../components/LeaderboardTable';

const API_BASE = '/api';

export async function fetchLeaderboard(categoryName?: string, limit = 100): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams();
  if (categoryName) params.set('category', categoryName);
  params.set('limit', String(limit));

  const res = await fetch(`${API_BASE}/leaderboard?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to load leaderboard (${res.status})`);
  return res.json();
}

export async function fetchMyEntry(clientId: string, categoryName: string): Promise<LeaderboardEntry | null> {
  const params = new URLSearchParams({ clientId, category: categoryName });
  const res = await fetch(`${API_BASE}/leaderboard/mine?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to load your score (${res.status})`);
  return res.json();
}

export async function submitLeaderboardEntry(entry: {
  clientId: string;
  playerName: string;
  categoryName: string;
  score: number;
  difficulty?: string;
  schoolLevel?: string;
}): Promise<LeaderboardEntry> {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Failed to submit score (${res.status})`);
  return res.json();
}
