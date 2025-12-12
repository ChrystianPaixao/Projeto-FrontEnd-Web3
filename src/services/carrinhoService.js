
import api from "./api";

export const obterCarrinho = () => api.get("/carrinho");
export const adicionarItem = (produtoId, quantidade) => {
  return api.post("/carrinho/itens", { produtoId, quantidade });
};
export const removerItem = (itemId) => api.delete(`/carrinho/itens/${itemId}`);
export const atualizarQuantidade = (itemId, quantidade) => {
    return api.patch(`/carrinho/itens/${itemId}`, {quantidade});
};
export const limparCarrinho = () => api.delete("/carrinho");