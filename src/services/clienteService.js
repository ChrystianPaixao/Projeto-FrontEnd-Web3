import api from "./api";

export const listarClientes = () => api.get('/clientes');
export const buscarClientePorToken = () => api.get('/clientes/me')
export const buscarClientePorId = (id) => api.get(`/clientes/${id}`);
export const criarCliente = (dados) => api.post('/clientes', dados);
export const atualizarCliente = (id, dados) => api.put(`/clientes/${id}`, dados);
export const deletarCliente = (id) => api.delete(`/clientes/${id}`);