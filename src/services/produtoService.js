import api from "./api";

export const listarProdutos = () => api.get('/produtos');
export const buscarProdutoID = (id) => api.get(`/produtos/${id}`);
export const filtros = (filtros) => api.get('/produtos/buscar', { params: filtros });
export const atualizarProduto = (id,dados) => api.put(`/produtos/${id}`,dados);
export const deletarProduto = (id) => api.delete(`/produtos/${id}`);
export const cadastrarProduto = (dados) => api.post('/produtos',dados);
export const categories = () => api.get('/categorias');