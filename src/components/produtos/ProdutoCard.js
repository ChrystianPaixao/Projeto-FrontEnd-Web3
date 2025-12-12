import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adicionarItem } from "@/services/carrinhoService";

export default function ProdutoCard({ produtos }) {
  const router = useRouter();

  const handleAdd = async (produtoId) => {
    await adicionarItem(produtoId, 1);
    router.push("/carrinho");
  };

  return (
    <Container className="py-4">
      <Row className="g-4">
        {produtos.map((produto) => (
          <Col key={produto.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm border-0 bg-dark text-white">
              <div style={{ height: "200px", overflow: "hidden" }}>
                <Link href={`/produtos/${produto.id}`}>
                  <Card.Img
                    variant="top"
                    src={produto.imagem}
                    style={{ height: "100%", width: "100%" }}
                  />
                </Link>
              </div>

              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold mb-2">
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="text-white text-decoration-none"
                  >
                    {produto.nome}
                  </Link>
                </Card.Title>

                <Card.Text className="text-light small flex-grow-1">
                  {produto.descricao}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="h5 fw-bold text-success">
                    R$ {produto.preco}
                  </span>

                  <span
                    className={`badge ${
                      produto.status === "ativo" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {produto.status}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-light">
                    Estoque: {produto.estoque}
                  </small>

                  {produto.categoria && (
                    <span className="badge bg-primary">
                      {produto.categoria.nome}
                    </span>
                  )}
                </div>

                <Button
                  variant={
                    produto.status === "ativo" && produto.estoque > 0
                      ? "light"
                      : "secondary"
                  }
                  className={`w-100 fw-medium ${
                    produto.status === "ativo" && produto.estoque > 0
                      ? "bg-white text-black"
                      : ""
                  }`}
                  disabled={produto.status !== "ativo" || produto.estoque === 0}
                  onClick={() => handleAdd(produto.id)}
                >
                  {produto.status !== "ativo"
                    ? "Indisponível"
                    : produto.estoque === 0
                    ? "Sem Estoque"
                    : "Adicionar ao Carrinho"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}