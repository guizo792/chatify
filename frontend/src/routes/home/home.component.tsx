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
          <a className="Home-link" href="/auth/login">
            HAPPY CHAT
          </a>
        </header>
      </div>
      <CopyrightSection />
    </>
  );
};

export default Home;
