import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { buscarPagamentoID, confirmarPagamento } from "@/services/pagamentoService";
import { toast } from "react-toastify";

export default function ConfirmarPagamentoPage() {
  const router = useRouter();
  const { id } = router.query;

  const [pagamento, setPagamento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      try {
        const resp = await buscarPagamentoID(id);
        setPagamento(resp.data);
      } catch (e) {
        toast.error("Erro ao carregar pagamento");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [id]);

  const handlePagar = async () => {
    try {
      setProcessando(true);
      await confirmarPagamento(id);

      toast.success("Pagamento confirmado!");
      router.push(`/pedidos/todosPedidos`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Erro ao confirmar pagamento");
    } finally {
      setProcessando(false);
    }
  };

  if (carregando || !pagamento) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Carregando pagamento...</p>
      </Container>
    );
  }

  const valorFormatado = Number(pagamento.valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <Container className="py-5">
      <Card className="p-4">
        <h3 className="mb-3">Confirmar Pagamento</h3>

        <p><strong>ID do Pagamento:</strong> {pagamento.id}</p>
        <p><strong>Método:</strong> {pagamento.metodo}</p>
        <p><strong>Valor:</strong> {valorFormatado}</p>

        <div className="d-flex gap-2 mt-4">
          <Button
            variant="secondary"
            className="flex-grow-1"
            onClick={() => router.push(`/clientes/perfil`)}
          >
            Voltar
          </Button>

          <Button
            variant="success"
            className="flex-grow-1"
            onClick={handlePagar}
            disabled={processando}
          >
            {processando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Confirmando...
              </>
            ) : "Confirmar Pagamento"}
          </Button>
        </div>
      </Card>
    </Container>
  );
}
