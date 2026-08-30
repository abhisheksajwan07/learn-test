export interface UserResponse {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface GetUserParams {
  id: string;
}
