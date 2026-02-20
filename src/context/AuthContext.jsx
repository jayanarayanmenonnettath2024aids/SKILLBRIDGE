import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = 'skillbridge_auth';

const defaultUser = {
    isAuthenticated: false,
    role: null,
    name: '',
    id: null
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultUser;
        } catch {
            return defaultUser;
        }
    });

    useEffect(() => {
        if (user.isAuthenticated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const login = (role, name = 'User') => {
        setUser({
            isAuthenticated: true,
            role,
            name,
            id: '12345'
        });
    };

    const logout = () => {
        setUser(defaultUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
