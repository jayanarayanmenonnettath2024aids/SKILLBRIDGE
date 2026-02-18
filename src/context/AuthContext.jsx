import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Roles: 'candidate', 'employer', 'kiosk', or null (guest)
    const [user, setUser] = useState({
        isAuthenticated: false,
        role: null, // 'candidate' | 'employer' | 'kiosk'
        name: '',
        id: null
    });

    const login = (role, name = 'User') => {
        setUser({
            isAuthenticated: true,
            role,
            name,
            id: '12345'
        });
    };

    const logout = () => {
        setUser({
            isAuthenticated: false,
            role: null,
            name: '',
            id: null
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
