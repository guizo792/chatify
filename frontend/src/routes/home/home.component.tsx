import { Link } from 'react-router-dom';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';

import logo from '../../assets/chat.svg';

import './home.styles.css';

const Home = () => {
  return (
    <>
      <div className="Home-container">
        <img src={logo} className="Home-logo" alt="logo" />
        <header className="Home-header">
          <p>
            enjoy <code>TEXTING</code> your friends <span>anytime</span>
            <span>anywhere</span>
          </p>
          <Link className="Home-link" to="/auth/login">
            HAPPY CHAT
          </Link>
        </header>
      </div>
      <CopyrightSection />
    </>
  );
};

export default Home;
