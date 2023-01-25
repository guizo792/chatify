import 'bootstrap/dist/css/bootstrap.css';
import { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import AuthContext from 'src/context/authContext';
import { logout } from 'src/services/authServices';
import { showAlert } from 'src/utils/alert';

import { ReactComponent as ChatLogo } from '../../assets/chat.svg';

import './navigation.styles.scss';

function NavScrollExample() {
  const { user } = useContext(AuthContext);
  let [userData, setUserData] = useState(user);

  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    if (res.status === 'success') {
      showAlert('Logging out ...', 'success');
      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
      navigate('/');
    }
  };

  // useEffect(() => {
  //   if (user) setUserData(user);
  // }, [user]);

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
          <Navbar.Brand
            href="/"
            className="nav-brand"
            style={{
              color: '#0275da',
              fontWeight: 'bold',
              fontSize: '1.6rem',
              paddingRight: '6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/about-us" className="nav-link">
                About us
              </Link>
              {userData && (
                <Link to="/chat" className="nav-link">
                  Chat
                </Link>
              )}
            </Nav>

            {!userData ? (
              <>
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
              </>
            ) : (
              <>
                <Link
                  to={'/'}
                  className="btn"
                  style={{
                    marginRight: '8px',
                    border: 'solid 1px var(--dark-color-a)',
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Link>
                <Link
                  to={'/profile'}
                  style={{
                    fontSize: '1.2rem',
                    marginLeft: '1.4rem',
                    marginRight: '1rem',
                    color: '#112a46',
                    fontWeight: '500',
                  }}
                >
                  {(userData as unknown as { name: string }).name}
                </Link>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default NavScrollExample;
