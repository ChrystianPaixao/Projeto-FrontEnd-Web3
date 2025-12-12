import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Card,
  Button,
  Spinner,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { buscarClientePorToken } from "@/services/clienteService";
import { meusPedidos, deletarPedido, checkoutPedido } from "@/services/pedidoService";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PerfilCliente() {
  const router = useRouter();
  const [cliente, setCliente] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        setCarregando(true);

        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Faça login primeiro!");
          router.push("/login");
          return;
        }

        const response = await buscarClientePorToken();
        setCliente(response.data);

        // Carregar pedidos após carregar cliente
        await carregarPedidos();
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);

        if (error.response?.status === 401) {
          toast.error("Sessão expirada!");
          localStorage.clear();
          router.push("/login");
        } else if (error.response?.status === 404) {
          toast.error("Perfil não encontrado!");
          router.push("/");
        } else {
          toast.error("Erro ao carregar perfil.");
        }
      } finally {
        setCarregando(false);
      }
    }

    async function carregarPedidos() {
      try {
        setCarregandoPedidos(true);
        const response = await meusPedidos();
        setPedidos(response.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setCarregandoPedidos(false);
      }
    }

    carregarPerfil();
  }, [router]);

const handleCheckout = async (pedidoId) => {
  try {
    await checkoutPedido(pedidoId);
    toast.success("Checkout realizado!");
    router.push(`/pagamentos/metodo/${pedidoId}`);
  } catch (error) {
    toast.error("Erro ao fazer checkout");
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

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const podeCheckout = (pedido) => {
    const status = pedido.status.toLowerCase();
    return status === "criado";
  };

  const podeRemover = (pedido) => {
    const status = pedido.status?.toLowerCase() || "";
    return status === "criado";
  };

  const podeContinuarCompra = (pedido) => {
  const status = pedido.status?.toLowerCase() || "";
  return status === "aguardando_pagamento";
};

  if (carregando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Carregando seus dados...</p>
      </Container>
    );
  }

  if (!cliente) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0 p-4">
          <h3 className="text-danger">Erro ao carregar dados</h3>
          <Button
            variant="outline-primary"
            className="mt-3"
            onClick={() => router.push("/login")}
          >
            Ir para Login
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
  <Card className="shadow-sm border-0 p-4 mb-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h3 className="fw-bold text-dark mb-0">Perfil</h3>
    </div>

    <Row>
      <Col md={6}>
        <p><strong>Nome:</strong> {cliente.nome}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Telefone:</strong> {cliente.telefone || "Não informado"}</p>
      </Col>
      <Col md={6}>
        <p>
          <strong>Data de Cadastro:</strong>{" "}
          {new Date(cliente.data_cadastro).toLocaleDateString("pt-BR")}
        </p>
      </Col>
    </Row>

    <div className="mt-4 pt-3 border-top">
      <Link href="/" passHref>
        <Button variant="dark" className="bg-black text-white me-3">
          ← Voltar para Home
        </Button>
      </Link>
    </div>
  </Card>

  <Card className="shadow-sm border-0 p-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="fw-bold mb-0">Meus Pedidos Recentes</h4>

      <Link href="/pedidos/todosPedidos" passHref>
        <Button variant="dark" size="sm" className="bg-black text-white">
          Ver Todos
        </Button>
      </Link>
    </div>

    {carregandoPedidos ? (
      <div className="text-center py-3">
        <Spinner animation="border" size="sm" variant="secondary" />
        <p className="mt-2 text-muted">Carregando pedidos...</p>
      </div>
    ) : pedidos.length > 0 ? (
      <div className="mt-3">
        {pedidos.slice(0, 5).map((pedido) => (
          <Card key={pedido.id} className="mb-3 border">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="fw-bold mb-1">Pedido #{pedido.id}</h6>
                  <p className="mb-1 text-muted small">
                    {formatarData(pedido.dataCriacao)}
                  </p>
                  <p className="mb-0">
                    <strong>Total:</strong> R$ {pedido.total.toFixed(2)}
                  </p>
                </div>

                <div className="text-end">
                  <div className="mb-2">{getStatusBadge(pedido.status)}</div>

                  <div className="d-flex gap-2">
                    <Link href={`/pedidos/${pedido.id}`} passHref>
                      <Button
                        variant="dark"
                        size="sm"
                        className="bg-black text-white"
                      >
                        Detalhes
                      </Button>
                    </Link>


                    {podeCheckout(pedido) && (
                      <Button
                        variant="sucess"
                        size="sm"
                        onClick={() => handleCheckout(pedido.id)}
                      >
                         Checkout
                      </Button>
                    )}

                    {/* Continuar Compra (amarelo) */}
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
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-4">
        <div className="mb-3">
          <span className="display-4 text-muted">hmm.....</span>
        </div>
        <h5 className="text-muted">Nenhum pedido encontrado</h5>
        <p className="text-muted small mb-3">
          Você ainda não fez nenhum pedido
        </p>
        <Link href="/" passHref>
          <Button variant="dark" className="bg-black text-white">
            Fazer minha primeira compra
          </Button>
        </Link>
      </div>
    )}
  </Card>
</Container>
  );
}
