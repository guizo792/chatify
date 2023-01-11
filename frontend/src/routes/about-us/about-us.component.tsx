import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';
import logo from '../../assets/chat.svg';

import '../home/home.styles.css';
import './about-us.styles.css';

const AboutUs = () => {
  return (
    <>
      <div className="Home-container about-us-container">
        <img src={logo} className="Home-logo about-us-logo" alt="logo" />
        <header className="Home-header about-us-header">
          <p>
            Bring your friends and start <span>enjoying</span> the chat <br />
            <span>Chatify</span> believes in connecting people through seamless{' '}
            <br />
            We are constantly updating and improving our platform to enhance
            your chatting experience. and efficient communication
          </p>
          <a href="/auth/login" className="Home-link">
            <code>Join CHATIFY</code>
          </a>
        </header>
      </div>
      <CopyrightSection />
    </>
  );
};

export default AboutUs;
