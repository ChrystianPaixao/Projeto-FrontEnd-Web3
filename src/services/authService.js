import api from "./api";

export const login = (credenciais) =>
  api.post("/auth/login", credenciais);

export const registrar = (dados) =>
  api.post("/auth/register", dados);

