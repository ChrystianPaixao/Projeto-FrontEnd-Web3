import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Card,
  Table,
  Badge,
  Spinner,
  Button,
} from "react-bootstrap";
import {
  meusPedidos,
  checkoutPedido,
  deletarPedido,
} from "@/services/pedidoService";
import { toast } from "react-toastify";
import Link from "next/link";

export default function TodosPedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setCarregando(true);
      const response = await meusPedidos();
      setPedidos(response.data);
    } catch (error) {
      toast.error("Erro ao carregar pedidos");
    } finally {
      setCarregando(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status.toLowerCase();
    const statusConfig = {
      criado: { variant: "secondary", label: "Criado" },
      aguardando_pagamento: {
        variant: "warning",
        label: "Aguardando Pagamento",
      },
      pago: { variant: "info", label: "Pago" },
      cancelado: { variant: "danger", label: "Cancelado" },
    };
    const config = statusConfig[statusLower] || {
      variant: "dark",
      label: status,
    };
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };

  const podeCheckout = (pedido) => pedido.status.toLowerCase() === "criado";

  const podeRemover = (pedido) => {
    const status = pedido.status?.toLowerCase() || "";
    return status === "criado" || status === "aguardando_pagamento";
  };

  const podeContinuarCompra = (pedido) =>
    pedido.status?.toLowerCase() === "aguardando_pagamento";

  const handleCheckout = async (pedidoId) => {
    try {
      await checkoutPedido(pedidoId);
      toast.success("Checkout realizado!");
      router.push(`/pagamentos/metodo/${pedidoId}`);
    } catch (error) {
      toast.error("Erro ao fazer checkout");
    }
  };

  const handleDeletar = async (pedidoId) => {
    try {
      await deletarPedido(pedidoId);
      toast.success("Pedido deletado!");
      carregarPedidos();
    } catch (error) {
      toast.error("Erro ao deletar pedido");
    }
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold mb-0">Todos os Meus Pedidos</h3>

          <Link href="/clientes/perfil" passHref>
            <Button className="bg-black text-white border-0 shadow-none" size="sm">
               Voltar ao Perfil
            </Button>
          </Link>
        </div>

        {carregando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
            <p className="mt-3">Carregando pedidos...</p>
          </div>
        ) : pedidos.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>#{pedido.id}</td>
                    <td>
                      {new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}
                    </td>
                    <td>R$ {pedido.total?.toFixed(2)}</td>
                    <td>{getStatusBadge(pedido.status)}</td>

                    <td>
                      <div className="d-flex justify-content-between gap-2">
                        <Button
                          className="bg-black text-white border-0 shadow-none"
                          style={{ outline: "none", boxShadow: "none" }}
                          size="sm"
                          onClick={() => router.push(`/pedidos/${pedido.id}`)}
                        >
                          Detalhes
                        </Button>

                        <div className="d-flex gap-2">
                          {podeCheckout(pedido) && (
                            <Button
                                variant="success"
                              size="sm"
                              onClick={() => handleCheckout(pedido.id)}
                            >
                              Checkout
                            </Button>
                          )}

                          {podeContinuarCompra(pedido) && (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() =>
                                router.push(`/pagamentos/metodo/${pedido.id}`)
                              }
                            >
                              Continuar Compra
                            </Button>
                          )}

                          {podeRemover(pedido) && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeletar(pedido.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">Nenhum pedido encontrado</p>

            <Link href="/" passHref>
              <Button className="bg-black text-white">
                Fazer minha primeira compra
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </Container>
  );
}
