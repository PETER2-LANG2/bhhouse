import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'ADMIN' | 'TENANT';

export interface User {
  username: string;
  role: Role;
  name: string;
  boarderId?: string; // Links a TENANT user to a specific boarder record
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('madaje_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('madaje_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('madaje_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
