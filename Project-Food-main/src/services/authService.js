import api from "./api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  const token = btoa(`${email}:${password}`);
  localStorage.setItem(TOKEN_KEY, token);
  
  // The backend login does not return the user object, so we construct a pseudo-user
  const user = { _id: email, email, name: email.split("@")[0] };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user, message: data };
};

export const signup = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  const token = btoa(`${email}:${password}`);
  localStorage.setItem(TOKEN_KEY, token);
  
  const user = { _id: email, email, name };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return { token, user, message: data };
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};