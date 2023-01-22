import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { ReactComponent as ChatLogo } from '../../assets/chat.svg';

import './navigation.styles.scss';

function NavScrollExample() {
  return (
    <>
      <Navbar
        // bg="light"
        expand="lg"
        style={{
          borderRadius: '6px',
          backgroundColor: '#EDEDED66',
        }}
      >
        <Container fluid>
          <Link
            to="/"
            className="nav-brand"
            style={{
              color: '#0275da',
              fontWeight: 'bold',
              fontSize: '1.6rem',
              padding: '2px 10px',
              paddingRight: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChatLogo style={{ height: '46px', width: '64px' }} />
            Chatify
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/about-us" className="nav-link">
                About us
              </Link>
            </Nav>

            <Link
              to={'/auth/login'}
              className="btn"
              style={{
                marginRight: '8px',
                border: 'solid 1px var(--dark-color-a)',
              }}
            >
              Login
            </Link>
            <Link
              to={'/auth/signup'}
              style={{
                backgroundColor: '#0275d8',
                color: '#fff',
                border: 'solid 1px #0275d8',
              }}
              className="btn signup-btn"
            >
              Sign up
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavScrollExample;
