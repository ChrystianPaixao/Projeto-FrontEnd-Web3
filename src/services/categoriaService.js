import api from "./api";

export const listarCategorias = () => api.get('/categorias');
export const buscarCategoriaPorId = (id) => api.get(`/categorias/${id}`);
export const criarCategoria = (categoriaData) => api.post('/categorias', categoriaData);
export const atualizarCategoria = (id, categoriaData) => api.put(`/categorias/${id}`, categoriaData);
export const deletarCategoria = (id) => api.delete(`/categorias/${id}`);