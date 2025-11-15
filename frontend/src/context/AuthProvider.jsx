import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  // Load authUser and token from localStorage initially
  const [authUser, setAuthUser] = useState(() => {
    const user = localStorage.getItem("authUser");
    return user ? JSON.parse(user) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Persist authUser in localStorage
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  // Persist token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Function to update both user and token on login
  const login = (userData, jwtToken) => {
    setAuthUser(userData);
    setToken(jwtToken);
  };

  // Function to logout and clear all
  const logout = () => {
    setAuthUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ authUser, token, setAuthUser, setToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
