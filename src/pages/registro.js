// Registro.js
import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { registrar } from '@/services/authService';
import Link from 'next/link';

export default function Registro() {
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setDadosCliente({
      ...dadosCliente,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (dadosCliente.senha !== dadosCliente.confirmarSenha) {
      toast.error('As senhas não coincidem!');
      return;
    }

    setCarregando(true);

    try {
      const { confirmarSenha, ...dadosParaEnviar } = dadosCliente;

      console.log("ENVIANDO PARA API:", dadosParaEnviar);

      await registrar(dadosParaEnviar);

      toast.success('Cadastro realizado com sucesso!');
      window.location.href = '/login';
    } catch (error) {
      console.log("ERRO NO REGISTRO:", error);

      if (error.response?.status === 400) {
        toast.error('Email já cadastrado!');
      } else {
        toast.error('Erro ao registrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };



  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Criar Conta</h2>
                <p className="text-muted">Preencha seus dados para se cadastrar</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={dadosCliente.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={dadosCliente.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefone"
                    value={dadosCliente.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="senha"
                    value={dadosCliente.senha}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirmar Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarSenha"
                    value={dadosCliente.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Digite novamente"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2"
                  disabled={carregando}
                >
                  {carregando ? 'Cadastrando...' : 'Criar Conta'}
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-primary text-decoration-none">
                    Faça login
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