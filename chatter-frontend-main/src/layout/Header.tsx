import Link from 'next/link';

import logo from '../assets/images/logo_chatter_color_2.png';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getUser, setLogoutData } from '../redux/userSlice';
import { LogoType } from '../types/chat';
import { useSessionStorage } from '../utils/customHooks';
import { LoadStart, LoadRemove } from '../components/Loading';

function Header() {
  const image = logo as unknown as LogoType;

  const userData = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const [token, setToken] = useSessionStorage('token', '');

  const signOff = () => {
    LoadStart()
    setToken(token)
    dispatch(setLogoutData());
    LoadRemove()
  };

  return (
    <Navbar expand="lg" className="mx-4 header header-height w-100" variant="dark">
      <Container className="mw-100 w-100 d-flex justify-content-between m-0">
        <Navbar.Brand className="brand-logo">
          <img src={image.src} className="mh-100 mw-100 d-block" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          {userData.authToken ? (
            <Nav className="d-flex gap-3">
              <Link href="/" className="nav-item" onClick={signOff} legacyBehavior={false}>
                Abandonar Sesión
              </Link>
            </Nav>
          ) : (
            <Nav className="d-flex gap-3">
              <Link href="/register" className="nav-item">
                Registrarse
              </Link>
              <Link href="/" className={'nav-item active'}>
                Iniciar Sesión
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
