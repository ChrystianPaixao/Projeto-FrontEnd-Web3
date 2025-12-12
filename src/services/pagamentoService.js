import api from "./api";

export const listarPagamentos = () => api.get("/pagamentos");
export const buscarPagamentoID = (id) => api.get(`/pagamentos/${id}`);
export const criarPagamento = (pedidoId, dados) =>
  api.post(`/pagamentos/pedidos/${pedidoId}`, dados);
export const atualizarPagamento = (id, dados) =>
  api.put(`/pagamentos/${id}`, dados);
export const confirmarPagamento = (id) => api.patch(`/pagamentos/${id}/pagar`);
export const cancelarPagamento = (id) =>
  api.patch(`/pagamentos/${id}/cancelar`);
export const deletarPagamento = (id) => api.delete(`/pagamentos/${id}`);
