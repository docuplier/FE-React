import PropTypes from 'prop-types';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import DFANavigationBar from 'reusables/DFANavigationBar';

const DFAProfileLayout = ({ children }) => {
  return (
    <>
      <DFANavigationBar />
      <MaxWidthContainer>{children}</MaxWidthContainer>
    </>
  );
};

DFAProfileLayout.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    imageSrc: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    department: PropTypes.string,
    gender: PropTypes.string,
    level: PropTypes.number,
    session: PropTypes.string,
    semester: PropTypes.string,
    location: PropTypes.string,
    age: PropTypes.number,
  }),
  maxWidthClassName: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
};

export default DFAProfileLayout;
