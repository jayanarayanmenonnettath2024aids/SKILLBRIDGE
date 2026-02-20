import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('skillbridge_user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                return {
                    isAuthenticated: false,
                    role: null,
                    name: '',
                    id: null,
                    email: ''
                };
            }
        }
        return {
            isAuthenticated: false,
            role: null,
            name: '',
            id: null,
            email: ''
        };
    });

    // Save to localStorage whenever user changes
    useEffect(() => {
        if (user.isAuthenticated) {
            localStorage.setItem('skillbridge_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('skillbridge_user');
        }
    }, [user]);

    const login = (role, name = 'User', id = null, email = '') => {
        setUser({
            isAuthenticated: true,
            role,
            name,
            id,
            email
        });
    };

    const logout = () => {
        setUser({
            isAuthenticated: false,
            role: null,
            name: '',
            id: null,
            email: ''
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
