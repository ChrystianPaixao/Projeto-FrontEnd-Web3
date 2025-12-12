import api from "./api";

export const listarPedidos = () => api.get('/pedidos');
export const meusPedidos = () => api.get('/pedidos/meus-pedidos');
export const buscarPedidoID = (id) => api.get(`/pedidos/${id}`);
export const criarPedidoDoCarrinho = () => api.post('/pedidos/do-carrinho');
export const checkoutPedido = (id) => api.patch(`/pedidos/${id}/checkout`);
export const confirmarPagamentoPedido = (id) =>api.patch(`/pedidos/${id}/confirmar-pagamento`);
export const atualizarPedido = (id, status) => api.put(`/pedidos/${id}`, { status });
export const deletarPedido = (id) => api.delete(`/pedidos/${id}`);
export const deletarPedidoAdmin = (id) => api.delete(`/pedidos/admin/${id}`);
