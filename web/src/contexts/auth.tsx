import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthResponse } from "../models/auth";
import { User } from "../models/user";
import { api } from "../services/api";

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
  children: React.ReactNode;
};

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>({} as User);
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=99897fd10fa9d1aa71a5`;

  const signIn = async (githubCode: string) => {
    try {
      const response = await api.post<AuthResponse>("authenticate", {
        code: githubCode,
      });
      const { token, user } = response.data;

      localStorage.setItem("@dowhile:token", token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      setUser(user);
    } catch (err) {
      throw new Error("Não foi possível logar com o github");
    }
  };

  const loadProfile = async () => {
    const token = localStorage.getItem("@dowhile:token");
    if (token) {
      try {
        api.defaults.headers.common.authorization = `Bearer ${token}`;
        const response = await api.get<User>("profile");
        setUser(response.data);
      } catch (err) {
        throw new Error("Não foi possível trazer os dados do usuário");
      }
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("@dowhile:token");
  };

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
