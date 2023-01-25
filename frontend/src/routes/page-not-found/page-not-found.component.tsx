import { Link } from 'react-router-dom';

import './page-not-found.styles.scss';

const PageNotFound = () => {
  return (
    <div id="notfound">
      <div className="notfound-bg"></div>
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2>we are sorry, but the page you requested was not found</h2>
        <Link to="/" className="home-btn">
          Go Home
        </Link>
        <Link to="/auth/login" className="contact-btn">
          Log in
        </Link>
        <div className="notfound-social">
          <Link to="facebook.com">
            <i className="fa fa-facebook"></i>
          </Link>
          <Link to="twitter.com">
            <i className="fa fa-twitter"></i>
          </Link>
          <Link to="#">
            <i className="fa fa-pinterest"></i>
          </Link>
          <Link to="#">
            <i className="fa fa-google-plus"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
