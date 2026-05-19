export interface User {
  id: string;
  full_name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  cf_turnstile_response: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  token_type: string;
  expires_in: string;
  user: User;
}
