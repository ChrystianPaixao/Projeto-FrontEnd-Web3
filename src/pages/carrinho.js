import { useEffect, useState } from "react";
import { Card, Button, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  obterCarrinho,
  removerItem,
  atualizarQuantidade,
  limparCarrinho,
} from "@/services/carrinhoService";
import { criarPedidoDoCarrinho } from "@/services/pedidoService";
import Link from "next/link";

export default function CarrinhoCard() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState(null);
  const [carregando, setCarregando] = useState(true);

  async function carregarCarrinho() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Faça login primeiro!");
        router.push("/login");
        return;
      }

      const response = await obterCarrinho();
      setCarrinho(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar o carrinho.");
    } finally {
      setCarregando(false);
    }
  }
  const handleCriarPedido = async () => {
    try {
      const response = await criarPedidoDoCarrinho();
      toast.success("Pedido criado!");
      router.push(`/pedidos/todosPedidos`);
    } catch (error) {
      toast.error("Erro ao criar pedido");
    }
  };

  async function handleRemover(id) {
    try {
      await removerItem(id);
      toast.success("Produto removido!");
      carregarCarrinho();
    } catch (err) {
      toast.error("Erro ao remover o item.");
    }
  }

  async function handleLimparCarrinho() {
    try {
      await limparCarrinho();
      toast.success("Carrinho limpo!");
      carregarCarrinho();
    } catch (err) {
      toast.error("Erro ao limpar o carrinho.");
    }
  }

  async function handleQuantidade(itemId, novaQtd) {
    try {
      if (novaQtd <= 0) {
        toast.error("Quantidade inválida!");
        return;
      }

      await atualizarQuantidade(itemId, novaQtd);
      carregarCarrinho();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erro ao atualizar quantidade"
      );
    }
  }

  useEffect(() => {
    carregarCarrinho();
  }, []);

  if (carregando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Carregando carrinho...</p>
      </Container>
    );
  }

  if (!carrinho || carrinho.itens.length === 0) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm p-4 text-center">
          <h4 className="text-secondary">Seu carrinho está vazio 🛒</h4>
          <Link href="/" passHref>
            <Button className="mt-3" variant="primary">
              Ir às compras
            </Button>
          </Link>
        </Card>
      </Container>
    );
  }

  const total = carrinho.itens.reduce(
    (soma, item) => soma + item.quantidade * item.precoUnitario,
    0
  );

  return (
    <Container className="py-4">
      <Card className="shadow-sm p-4">
        <h3 className="fw-bold mb-4 text-primary">🛒 Meu Carrinho</h3>

        {carrinho.itens.map((item) => (
          <Card key={item.id} className="mb-3 p-3 shadow-sm border-0">
            <div className="d-flex align-items-center">
              <img
                src={item.produto?.imagem}
                alt={item.produto?.nome}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />

              <div className="ms-3 flex-grow-1">
                <h5 className="fw-bold">{item.produto?.nome}</h5>
                <p className="text-muted mb-1">
                  Preço: R$ {item.precoUnitario}
                </p>

                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      handleQuantidade(item.id, item.quantidade - 1)
                    }
                  >
                    -
                  </Button>

                  <span className="mx-3">{item.quantidade}</span>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      handleQuantidade(item.id, item.quantidade + 1)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                variant="outline-danger"
                onClick={() => handleRemover(item.id)}
              >
                Remover
              </Button>
            </div>
          </Card>
        ))}

        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <h4 className="mb-0">
            Total: <span className="text-primary fw-bold">R$ {total}</span>
          </h4>

          <div className="d-flex gap-2">
            <Button variant="success" onClick={handleCriarPedido}>
              Criar pedido
            </Button>

            <Button variant="danger" onClick={handleLimparCarrinho}>
              Limpar carrinho
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
}
