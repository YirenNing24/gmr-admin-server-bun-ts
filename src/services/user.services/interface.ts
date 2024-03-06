
export interface Authentication {
    username: string
    password: string
}

export interface AuthenticationResponse {
    admin: string;
    userId: string;
    username: string;
    email: string;
    registeredAt: number;
    refreshToken: string;
    accessToken: string;
    
}

export interface UserProperties {
    admin: string;
    userId: string;
    username: string;
    email: string;
    registeredAt: number;
    refreshToken: string;
    accessToken: string;
    
    
}

export interface UserRegistrationData {
    access: string
    username: string
    email: string
    password: string
}

export interface NewUser {
    access: string
    username: string
    email: string
    encryptedPassword: string
    registeredAt: number
    userId: string
}