import { SESSION_COOKIE_NAME } from '@/lib/auth-constants';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextType {
    logout: () => Promise<void>;
    isAuthenticated: () => Promise<boolean>;
}

const defaultContext = {
    isAuthenticated: async () => false,
    logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: ReactNode }) {
    const cookieName = SESSION_COOKIE_NAME;
    const isAuthenticated = async () => {
        try {
            const response = await axios.get('/api/v1/auth/is-logged-in');
            return response.data.data.userLoggedIn;
        } catch (e) {
            if (
                e instanceof AxiosError &&
                e.response?.status === HttpStatusCode.Unauthorized
            ) {
                return false;
            }
            throw e;
        }
    };

    const logout = async () => {
        await cookieStore.delete(cookieName);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used withing an AuthProvider');
    }
    return context;
};
