import { buscarProdutoID } from "@/services/produtoService";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
} from "react-bootstrap";
import { adicionarItem } from "@/services/carrinhoService";

export default function ProdutoDetalhe() {
  const router = useRouter();
  const { id } = router.query;

  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (!id) return;

    async function carregarProduto() {
      try {
        const response = await buscarProdutoID(id);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao procurar produto:", error);
        toast.error("Produto não encontrado!");
      }
    }

    carregarProduto();
  }, [id]);

  if (!produto) return null;

  const disponivel = produto.status === "ativo" && produto.estoque > 0;

  const incrementarQuantidade = () => {
    if (quantidade < produto.estoque) setQuantidade(quantidade + 1);
  };

  const decrementarQuantidade = () => {
    if (quantidade > 1) setQuantidade(quantidade - 1);
  };

  const handleAdicionarCarrinho = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debug

      if (!token) {
        toast.error("Faça login antes de adicionar produtos.");
        router.push("/login");
        return;
      }

      console.log("Adicionando ao carrinho:", {
        produtoId: produto.id,
        quantidade,
      }); // Debug

      const response = await adicionarItem(produto.id, quantidade);
      console.log("Resposta do carrinho:", response); // Debug

      toast.success(`${quantidade}x ${produto.nome} adicionado ao carrinho!`);
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta do erro:", error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Faça login novamente.");
        localStorage.removeItem("token");
        router.push("/login");
      } else if (error.response?.status === 404) {
        toast.error("Produto não encontrado");
      } else {
        toast.error(
          error.response?.data?.message || "Erro ao adicionar ao carrinho"
        );
      }
    }
  };

  return (
    <Container className="py-5">
      <Row className="mt-4">
        <Col>
          <Link href="/" passHref>
            <Button variant="outline-secondary">
              ← Voltar para a lista de produtos
            </Button>
          </Link>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Img
              variant="top"
              src={produto.imagem || "/placeholder-image.jpg"}
              alt={produto.nome}
              style={{
                height: "400px",
                objectFit: "cover",
                width: "100%",
              }}
            />
          </Card>
        </Col>

        <Col md={6}>
          <div className="ps-md-4">
            {produto.categoria && (
              <Badge bg="primary" className="mb-2">
                {produto.categoria.nome}
              </Badge>
            )}

            <h1 className="h2 fw-bold text-dark mb-3">{produto.nome}</h1>
            <div className="mb-4">
              <span className="h3 text-success fw-bold">
                R$ {Number(produto.preco).toFixed(2)}
              </span>
              <small className="text-muted ms-2">à vista</small>
            </div>

            <div className="mb-4">
              <span
                className={`badge ${
                  disponivel ? "bg-success" : "bg-danger"
                } me-2`}
              >
                {disponivel ? "Disponível" : "Indisponível"}
              </span>
              <span className="text-muted">
                {produto.estoque} unidades em estoque
              </span>
            </div>

            <div className="mb-4">
              <h5 className="fw-semibold">Descrição</h5>
              <p className="text-muted">{produto.descricao}</p>
            </div>
            {disponivel ? (
              <div className="border-top pt-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <label className="fw-semibold">Quantidade:</label>
                  <div className="d-flex align-items-center border rounded">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={decrementarQuantidade}
                      disabled={quantidade <= 1}
                      style={{ border: "none" }}
                    >
                      -
                    </Button>
                    <span className="px-3 fw-bold">{quantidade}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={incrementarQuantidade}
                      disabled={quantidade >= produto.estoque}
                      style={{ border: "none" }}
                    >
                      +
                    </Button>
                  </div>
                  <small className="text-muted">
                    Máx: {produto.estoque} unidades
                  </small>
                </div>

                <div className="d-flex gap-3">
                  <Link
                    href="/carrinho"
                    onClick={handleAdicionarCarrinho}
                    passHref
                  >
                    <Button
                      variant="light"
                      size="lg"
                      className="bg-white text-black border border-dark"
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Alert variant="warning" className="mt-4">
                <Alert.Heading>Produto Indisponível</Alert.Heading>
                <p>
                  Este produto está temporariamente fora de estoque ou inativo.
                </p>
                <Link href="/produtos" passHref>
                  <Button variant="outline-primary">Ver outros produtos</Button>
                </Link>
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
