import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import NavigationBar from 'reusables/NavigationBar';
import useNotification from 'reusables/NotificationBanner/useNotification';
import LoadingButton from 'reusables/LoadingButton';
import GetInTouchImage from 'assets/svgs/getInTouch.png';
import { fontSizes, fontWeight, spaces } from '../Css';
import { FAQ } from './Users/mockData';
import HelpMessageSuccessModal from 'components/HelpMessageSuccessModal';
import { SEND_HELP_MESSAGE } from 'graphql/mutations/help';
import { getFormError } from 'utils/formError';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';

const Help = () => {
  const classes = useStyles();
  const notification = useNotification();
  const [isVisible, setIsVisible] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm();
  const { message } = watch();
  const { userDetails } = useAuthenticatedUser();

  const [sendEmail, { loading }] = useMutation(SEND_HELP_MESSAGE, {
    onCompleted: () => {
      notification.success({
        message: 'Message sent succcessfully',
      });
      setIsVisible(true);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (values) => {
    sendEmail({
      variables: {
        message: values.message,
      },
    });
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const renderGetInTouch = () => {
    return (
      <Box>
        <Box textAlign="center" py={20}>
          <Typography color="textPrimary" className={classes.heading}>
            Get in touch
          </Typography>
          <Typography color="textSecondary" className={classes.caption}>
            Have any complaints, suggestions, inquiry, or some feedback for us? Fill out the form
            below to contact our team.
          </Typography>
        </Box>
        <Grid container>
          <Grid item sm={12} md={5} xs={12} className={classes.imgGrid}>
            <img src={GetInTouchImage} className={classes.img} alt="person reading" />
          </Grid>
          <Grid item md={1} xs={12}></Grid>
          <Grid item sm={12} md={6} xs={12}>
            <Box pb={8}>
              <Typography
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: fontWeight.bold }}>
                Address
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {userDetails?.roles?.includes(UserRoles.GLOBAL_ADMIN)
                  ? '7, Omo Ighodalo Street, Ogudu GRA. Ogudu, Lagos.'
                  : userDetails?.institution?.address}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" pb={16}>
              <Box pr={30}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{ fontWeight: fontWeight.bold }}>
                  E-mail
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {userDetails?.roles?.includes(UserRoles.GLOBAL_ADMIN)
                    ? 'support@delsu.com'
                    : userDetails?.institution?.email}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  style={{ fontWeight: fontWeight.bold }}>
                  Phone
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {userDetails?.roles?.includes(UserRoles.GLOBAL_ADMIN)
                    ? '+234 (0) 801 234 5678'
                    : userDetails?.institution?.phone}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="h5" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
                Send us a message
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  label="Message"
                  name="message"
                  inputRef={register({ required: true })}
                  multiline={true}
                  rows={11}
                  variant="outlined"
                  fullWidth
                  error={getFormError('message', errors).hasError}
                  helperText={getFormError('message', errors).message}
                  placeholder="Enter Message"
                />
                <LoadingButton
                  variant="contained"
                  fullWidth
                  type="submit"
                  color="primary"
                  disabled={Boolean(message) === false}
                  isLoading={loading}>
                  Send Message
                </LoadingButton>
              </form>
            </Box>
          </Grid>
        </Grid>
        <HelpMessageSuccessModal visible={isVisible} onClose={onClose} />
      </Box>
    );
  };

  const renderFAQ = () => {
    return (
      <Box my={40}>
        <Box textAlign="center" pb={20}>
          <Typography color="textPrimary" className={classes.heading}>
            Frequently asked questions
          </Typography>
          <Typography color="textSecondary" className={classes.caption}>
            These are the frequently asked questions. If you have any questions, please contact us.
          </Typography>
        </Box>
        {FAQ.map((faq, index) => (
          <Accordion key={index} classes={{ root: classes.accordion }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.accordionSummary}>
              <Typography variant="body1" color="textPrimary" className={classes.summary}>
                {faq.sumary}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accodionDetail}>
              <Typography variant="body1" color="textSecondary">
                {faq.detail}
              </Typography>
              <br />
              <Typography variant="body1" color="textSecondary">
                {faq?.extra}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  return (
    <div>
      <NavigationBar />
      <MaxWidthContainer>
        {renderGetInTouch()}
        {renderFAQ()}
      </MaxWidthContainer>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: 15,
    '& > *': {
      marginBottom: 20,
    },
  },
  heading: {
    fontWeight: fontWeight.bold,
    fontSize: 40,
    marginBottom: 6,
  },
  caption: {
    fontSize: fontSizes.xlarge,
  },
  accordionSummary: {
    background: '#F0F5FF',
    padding: '0 20px',
  },
  accodionDetail: {
    padding: '20px',
    display: 'block',
  },
  summary: {
    fontWeight: fontWeight.bold,
  },
  accordion: {
    marginBottom: 10,
    '& .MuiAccordion-root:before': {
      backgroundColor: 'none',
      opacity: 0,
    },
  },
  img: {
    objectFit: 'contain',
    marginRight: spaces.medium,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      marginRight: 0,
    },
  },
  imgGrid: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: spaces.large,
    },
  },
}));

export default Help;
