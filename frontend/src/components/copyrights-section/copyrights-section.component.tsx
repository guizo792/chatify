import { CopyrightSectionContainer } from './copyrights-section.styles';

const date = new Date();
const year = date.getFullYear();

const CopyrightSection = () => {
  return (
    <CopyrightSectionContainer className="section">
      Made with 💙 by Chatify team <br />
      &copy;{year} All rights reserved
    </CopyrightSectionContainer>
  );
};

export default CopyrightSection;
