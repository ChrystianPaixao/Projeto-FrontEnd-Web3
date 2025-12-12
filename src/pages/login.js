import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { login } from '@/services/authService';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from "@/services/AuthContext";

export default function Login() {
  const [credenciais, setCredenciais] = useState({ email: '', senha: '' });
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const { login: loginContext } = useAuth();

  const handleChange = (e) => {
    setCredenciais({
      ...credenciais,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const response = await login(credenciais);
      const { token, usuario } = response.data;

      // Atualizar AuthContext
      loginContext(token, usuario);

      toast.success(`Bem-vindo, ${usuario.nome}!`);
      router.push("/clientes/perfil");

    } catch (error) {
      toast.error("Email ou senha incorretos!");
      console.error("Erro no login:", error);
    } finally {
      setCarregando(false);
    }
};

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Entrar</h2>
                <p className="text-muted">Acesse sua conta</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={credenciais.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={credenciais.senha}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={carregando}
                >
                  {carregando ? 'Entrando...' : 'Entrar'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Não tem uma conta?{' '}
                  <Link href="/registro" className="text-primary text-decoration-none">
                    Cadastre-se
                  </Link>
                </p>
              </div>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
