import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Empty from 'reusables/Empty';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { Typography, Grid, Divider, Button, Box, Paper } from '@material-ui/core';
import { fontSizes, fontWeight, colors, fontFamily, borderRadius, spaces } from '../../../Css.js';

const Interests = ({ data }) => {
  const classes = useStyles();

  const renderEmptyState = () => {
    return <Empty title={'No Data'} description={'No Data Avalaible.'}></Empty>;
  };

  return (
    <Box pb={40}>
      <MaxWidthContainer>
        <Box px={24} py={24} component={Paper} square mt={40}>
          <Box className={classes.header}>
            <Typography color="textPrimary" variant="h5" className="title">
              Interest
            </Typography>
            <Typography>
              Some info may be visible to other people using LMS services.{' '}
              <Typography component="span" className="span">
                Learn more
              </Typography>
            </Typography>
          </Box>
          <Box className={classes.divider}>
            <Typography variant="body2" color="textSecondary">
              Interests
            </Typography>
            <Divider classes={{ root: classes.line }} />
          </Box>
          {Boolean(data?.length) ? (
            <Grid container spacing={8}>
              {data?.map((option) => {
                return (
                  <Grid item>
                    <Button
                      key={option?.id}
                      className={classes.checked}
                      variant="contained"
                      color="primary">
                      {option.name}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            renderEmptyState()
          )}
        </Box>
      </MaxWidthContainer>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  header: {
    '& .title': {
      fontWeight: fontWeight.bold,
      paddingBottom: spaces.small,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
    '& .span': {
      color: colors.primary,
      cursor: 'pointer',
    },
  },
  divider: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spaces.medium,
    marginTop: spaces.small,
  },
  line: {
    margin: 'auto',
    width: '75%',
  },
  checked: {
    width: 230,
    height: 63,
    borderRadius: borderRadius.small,
    fontSize: fontSizes.small,
    fontFamily: fontFamily.primary,
    display: 'grid',
    placeItems: 'center',
    border: `solid 1px ${colors.primary}`,
  },
}));

Interests.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Interests;
