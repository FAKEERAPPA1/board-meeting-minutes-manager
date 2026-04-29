import api from "./api";

export const loginUser = (username, password) =>
    api.post("/auth/login", { username, password });

export const registerUser = (username, password, email) =>
    api.post("/auth/register", { username, password, email });