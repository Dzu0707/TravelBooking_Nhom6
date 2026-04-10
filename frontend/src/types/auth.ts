export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  fullName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}