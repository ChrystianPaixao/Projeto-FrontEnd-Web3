import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Card, Button, Spinner, Badge } from "react-bootstrap";
import { buscarPedidoID, checkoutPedido } from "@/services/pedidoService";
import { toast } from "react-toastify";
import Link from "next/link";

export default function DetalhesPedido() {
  const router = useRouter();
  const { id } = router.query;
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) carregarPedido();
  }, [id]);

  async function carregarPedido() {
    try {
      const response = await buscarPedidoID(id);
      setPedido(response.data);
    } catch (error) {
      toast.error("Pedido não encontrado");
      router.push("/pedidos");
    } finally {
      setCarregando(false);
    }
  }

  const getStatusBadge = (status) => {
    const config =
      {
        CRIADO: "secondary",
        AGUARDANDO_PAGAMENTO: "warning",
        PAGO: "success",
        CANCELADO: "danger",
      }[status] || "dark";

    return <Badge bg={config}>{status}</Badge>;
  };

  const podeCheckout = (pedido) => {
    const status = pedido.status.toLowerCase();
    return status === "criado" || status === "aguardando_pagamento";
  };

  const handleCheckout = async () => {
    try {
      await checkoutPedido(pedido.id);
      toast.success("Checkout realizado!");
      router.push(`/pagamentos/metodo/${pedido.id}`);
    } catch (error) {
      toast.error("Erro ao fazer checkout");
    }
  };

  if (carregando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Carregando pedido...</p>
      </Container>
    );
  }

  if (!pedido) return null;

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h2>Pedido #{pedido.id}</h2>
        <p className="text-muted">
          Realizado em{" "}
          {new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <Card className="mb-3">
        <Card.Body className="text-center">
          <h5>Status: {getStatusBadge(pedido.status)}</h5>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <h5>Informações</h5>
          <p>
            <strong>Total:</strong> R$ {pedido.total?.toFixed(2) || "0.00"}
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5>Itens do Pedido</h5>
          {pedido.itens?.map((item, index) => {
            const preco = item.preco || item.precoUnitario || 0;
            const nome = item.produto?.nome || item.nome || "Produto";
            const quantidade = item.quantidade || 0;

            return (
              <div key={index} className="border-bottom py-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{nome}</strong>
                    <div className="text-muted small">
                      {quantidade}x R$ {Number(preco).toFixed(2)}
                    </div>
                  </div>
                  <strong>R$ {(Number(preco) * quantidade).toFixed(2)}</strong>
                </div>
              </div>
            );
          })}

          <div className="text-end mt-3 pt-2 border-top">
            <h5>Total: R$ {Number(pedido.total).toFixed(2)}</h5>
          </div>
        </Card.Body>
      </Card>
      <br></br>
      <Link href="/pedidos/todosPedidos">
        <Button variant="outline-secondary">← Voltar</Button>
      </Link>
      {podeCheckout(pedido) && (
        <div className="mt-3">
          <Button variant="outline-primary me-2" onClick={handleCheckout}>
            Continuar Compra
          </Button>
        </div>
      )}
    </Container>
  );
}
