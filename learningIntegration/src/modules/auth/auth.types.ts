export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface MeResponse {
  user: {
    id: number;
    email: string;
    name: string;
    createdAt: string;
  };
}
