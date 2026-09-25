import { LeaderboardEntry } from '../components/LeaderboardTable';

const API_BASE = '/api';

export interface AnswerResult {
  points: number;
  score: number;
}

export interface RoundResult {
  roundScore: number;
  entry: LeaderboardEntry | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error(`Request to ${path} failed (${res.status})`);
  return res.json();
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export function fetchLeaderboard(categoryId?: string, limit = 100): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (categoryId) params.set('category', categoryId);
  return request(`/leaderboard?${params.toString()}`);
}

export function fetchMyEntry(categoryId: string): Promise<LeaderboardEntry | null> {
  return request(`/leaderboard/mine?${new URLSearchParams({ category: categoryId }).toString()}`);
}

export async function startRound(categoryId: string): Promise<string> {
  const { roundId } = await post<{ roundId: string }>('/rounds', { categoryId });
  return roundId;
}

export function submitAnswer(roundId: string, questionId: string, correct: boolean): Promise<AnswerResult> {
  return post(`/rounds/${encodeURIComponent(roundId)}/answers`, { questionId, correct });
}

export function finishRound(roundId: string): Promise<RoundResult> {
  return post(`/rounds/${encodeURIComponent(roundId)}/finish`);
}
