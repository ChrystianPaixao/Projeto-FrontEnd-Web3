import { Navbar, Nav, Container } from "react-bootstrap";
import Link from "next/link";
import { useAuth } from "@/services/AuthContext";

export default function Header() {
  const { usuario, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/" className="fw-bold fs-4 text-white">
          Web 3 
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/" className="fw-medium text-white">
              Home
            </Nav.Link>

            <Nav.Link as={Link} href="/" className="fw-medium text-white">
              Produtos
            </Nav.Link>

            <Nav.Link as={Link} href="/carrinho" className="fw-medium text-white">
              Carrinho
            </Nav.Link>
          </Nav>

          <Nav className="d-flex flex-row gap-3">
            {usuario ? (
              <>
                <Link href="/clientes/perfil" className="btn btn-outline-light">
                  Perfil {usuario.role === "admin" && "foda"}
                </Link>

                <button className="btn btn-danger" onClick={logout}>
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline-light">
                  Entrar
                </Link>
                <Link href="/registro" className="btn btn-primary">
                  Cadastrar
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
