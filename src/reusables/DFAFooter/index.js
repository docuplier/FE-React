import { Box, Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import logoImage from 'assets/svgs/newDFA-logo.svg';

const DFAFooter = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  function renderMobileLogo() {
    return (
      <>
        <img src={logoImage} alt="logo" />
      </>
    );
  }

  return (
    <Paper style={{ borderTop: '0.005px solid #DCDCDC' }}>
      <MaxWidthContainer spacing={'sm'}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {!isSmallScreen && (
              <Box mr={5}>
                <img src={logoImage} alt="logo" />
              </Box>
            )}
            <>{isSmallScreen && renderMobileLogo()}</>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography style={{ fontSize: '14px' }}>© 2023 Tech4Dev, Inc.</Typography>
          </Box>
        </Box>
      </MaxWidthContainer>
    </Paper>
  );
};

export default DFAFooter;
