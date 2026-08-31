import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('gramniti_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [initialModalStep, setInitialModalStep] = useState(1);

  // Restore authenticated session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('gramniti_auth_token');
    if (savedToken) {
      api.getCurrentUser(savedToken)
        .then((data) => {
          if (data && data.status === 'SUCCESS') {
            setCurrentUser(data);
          } else {
            // Token expired or invalid
            localStorage.removeItem('gramniti_auth_token');
            setToken(null);
            setCurrentUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('gramniti_auth_token');
          setToken(null);
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (fullName, phoneOrEmail, password, preferredLanguages = ['en']) => {
    const res = await api.signup({
      full_name: fullName,
      phone_or_email: phoneOrEmail,
      password: password,
      preferred_languages: preferredLanguages,
    });

    if (res && res.status === 'SUCCESS') {
      if (res.auth_token) {
        localStorage.setItem('gramniti_auth_token', res.auth_token);
        setToken(res.auth_token);
      }
      setCurrentUser(res);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const login = async (phoneOrEmail, password) => {
    const res = await api.login({
      phone_or_email: phoneOrEmail,
      password: password,
    });

    if (res && res.status === 'SUCCESS') {
      if (res.auth_token) {
        localStorage.setItem('gramniti_auth_token', res.auth_token);
        setToken(res.auth_token);
      }
      setCurrentUser(res);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const saveOnboarding = async (onboardingPayload) => {
    const res = await api.saveOnboarding(onboardingPayload, token);
    if (res && res.status === 'SUCCESS') {
      setCurrentUser((prev) => ({
        ...(prev || {}),
        ...res,
        onboarding_completed: true,
      }));
      return res;
    }
    throw new Error(res.message || 'Saving onboarding failed');
  };

  const logout = async () => {
    try {
      if (token) {
        await api.logout(token);
      }
    } catch (e) {
      console.warn("Logout notice:", e);
    } finally {
      localStorage.removeItem('gramniti_auth_token');
      setToken(null);
      setCurrentUser(null);
    }
  };

  const openAuthModal = (step = 1) => {
    setInitialModalStep(step);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        isOnboarded: !!currentUser?.onboarding_completed,
        loading,
        showAuthModal,
        initialModalStep,
        signup,
        login,
        saveOnboarding,
        logout,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
