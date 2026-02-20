import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage if available
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        if (storedUser && authToken) {
            try {
                const userData = JSON.parse(storedUser);
                return {
                    isAuthenticated: true,
                    role: userData.role || 'candidate',
                    name: userData.fullName || userData.name || 'User',
                    email: userData.email || '',
                    id: userData.id || userData._id
                };
            } catch (e) {
                return {
                    isAuthenticated: false,
                    role: null,
                    name: '',
                    email: '',
                    id: null
                };
            }
        }
        
        return {
            isAuthenticated: false,
            role: null,
            name: '',
            email: '',
            id: null
        };
    });

    const login = (role, userData = null) => {
        const userName = userData?.fullName || userData?.name || 'User';
        const userEmail = userData?.email || '';
        const userId = userData?.id || userData?._id || null;
        
        const newUser = {
            isAuthenticated: true,
            role,
            name: userName,
            email: userEmail,
            id: userId
        };
        
        setUser(newUser);
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('tempToken');
        
        setUser({
            isAuthenticated: false,
            role: null,
            name: '',
            email: '',
            id: null
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
