import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';

import { ReactComponent as ChatLogo } from '../../assets/chat.svg';

function NavScrollExample() {
  return (
    <>
      <Navbar bg="light" expand="lg" style={{ borderRadius: '6px' }}>
        <Container fluid>
          <Navbar.Brand
            href="#"
            style={{ color: '#0275da', fontWeight: 'bold' }}
          >
            <ChatLogo style={{ height: '46px', width: '64px' }} />
            Chatify
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about-us">About us</Nav.Link>
            </Nav>

            <Button style={{ marginRight: '8px' }}>Login</Button>
            <Button
              // variant="secondary"
              style={{
                backgroundColor: '#0275d8',
                color: '#fff',
                border: 'solid 1px #0275d8',
              }}
            >
              Sign up
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavScrollExample;
