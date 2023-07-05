"use client";
import { ReactNode, createContext, useContext, useState } from "react";

type AppContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const appContextDefaultValues: AppContextType = {
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};
export const AppContext = createContext<AppContextType>(
  appContextDefaultValues
);

export type Props = {
  children: ReactNode;
};
export function useAppContext() {
  return useContext(AppContext);
}

export default function Context({ children }: Props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const login = () => {
    userHasAuthenticated(true);
  };
  const logout = () => {
    userHasAuthenticated(false);
  };
  const value = {
    login,
    logout,
    isAuthenticated,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
