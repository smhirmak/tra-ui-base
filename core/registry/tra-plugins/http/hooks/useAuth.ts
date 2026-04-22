import http from '@/lib/http';
import type { AuthUser } from '@/contexts/auth/AuthContext';

export function useAuth() {
  // AuthProvider'dan useAuth'u re-export eder; bu hook burada kullanılır
  // Doğrudan AuthContext'ten import edin: import { useAuth } from '@/contexts/auth/AuthContext'
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await http.get<AuthUser>('/auth/me');
  return data;
}
