export interface LoginResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string
}

export interface UserResponse {
    id: string;       
    email: string;
    fullName: string;
    userName: string;
}