import { useState } from "react";
import { useRouter } from "next/router";
import { Container, Card, Button, Form, Spinner } from "react-bootstrap";
import { criarPagamento } from "@/services/pagamentoService";
import { toast } from "react-toastify";
import Link from "next/link";

export default function MetodoPagamentoPage() {
  const router = useRouter();

  const { id: pedidoId } = router.query;

  const [metodo, setMetodo] = useState("Cartao");
  const [processando, setProcessando] = useState(false);

  const handleFinalizarCompra = async () => {
    try {
      setProcessando(true);
      const response = await criarPagamento(pedidoId, { metodo });
      const pagamentoId = response.data.id;

      toast.success("Pagamento criado com sucesso!");
      router.push(`/pagamentos/${pagamentoId}/pagar`);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao processar pagamento");
    } finally {
      setProcessando(false);
    }
  };

  if (!router.isReady) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Carregando método de pagamento...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="p-4">
        <h3 className="mb-4"> Pagamento do Pedido #{pedidoId}</h3>
        <p className="text-muted mb-4">Escolha como deseja pagar:</p>

        <Form>
          <div className="mb-4">
            <Form.Check
              type="radio"
              label=" Cartão de Credito"
              name="metodo"
              checked={metodo === "Cartao"}
              onChange={() => setMetodo("Cartao")}
            />

            <Form.Check
              type="radio"
              label=" PIX "
              name="metodo"
              checked={metodo === "PIX"}
              onChange={() => setMetodo("PIX")}
            />

            <Form.Check
              type="radio"
              label=" Boleto Bancário"
              name="metodo"
              checked={metodo === "Boleto"}
              onChange={() => setMetodo("Boleto")}
            />
          </div>

          <div className="d-flex gap-2">
            <Link href={`/pedidos/${pedidoId}`} className="flex-grow-1">
              <Button variant="outline-secondary" className="w-100">
                ← Voltar
              </Button>
            </Link>

            <Button
              variant="success"
              onClick={handleFinalizarCompra}
              disabled={processando}
              className="flex-grow-1"
            >
              {processando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processando...
                </>
              ) : (
                `Pagar com ${metodo}`
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}