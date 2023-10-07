import React, { useState } from 'react';
import { Typography, Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CreateOutlined, Close } from '@material-ui/icons';

import { ReactComponent as InstitutionIcon } from 'assets/svgs/institution-icon.svg';
import { fontSizes, fontWeight, colors, fontFamily, spaces, borderRadius } from '../../../Css.js';
import EmptyList from 'components/Authentication/LearnersRegistration/EmptyList.js';
import LoadingButton from 'reusables/LoadingButton.jsx';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import TraingCertificateModal from './TrainingCertificateModal.js';
import { ReactComponent as Plus } from 'assets/svgs/plus.svg';

const options = [
  {
    school: 'Delta University of Technology',
    course: 'Bachelor of Science (B.Sc.), Business Administration',
    year: 'Oct, 1992 - July, 1996',
  },
  {
    school: 'Delta University of Technology',
    course: 'Bachelor of Science (B.Sc.), Business Administration',
    year: 'Oct, 1992 - July, 1996',
  },
  {
    school: 'Delta University of Technology',
    course: 'Bachelor of Science (B.Sc.), Business Administration',
    year: 'Oct, 1992 - July, 1996',
  },
];

const TrainingAndCertificate = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const [visibility, setVisibility] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    handleNextTab(activeTab + 1);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <Typography className="header-text">Training Certificate</Typography>
        <Box className="btn-modal" onClick={() => setVisibility(true)}>
          <Plus />
        </Box>
      </div>

      {options.length < 1 && (
        <EmptyList
          caption="You currently have no certificate"
          onClick={() => setVisibility(true)}
        />
      )}
      <Box>
        {options.map((option) => {
          return (
            <Paper square className={classes.institution}>
              <InstitutionIcon />
              <div>
                <Typography style={{ fontWeight: 'bold' }} variant="subtitle2" color="textPrimary">
                  {option.school}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {option.course}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {option.year}
                </Typography>
              </div>
              <div style={{ display: 'flex' }}>
                <CreateOutlined />
                <Close />
              </div>
            </Paper>
          );
        })}
      </Box>
      <div className={classes.foot}>
        <LoadingButton
          endIcon={<ChevronRight />}
          className="btn"
          type="submit"
          onClick={onSubmit}
          color="primary"
          isLoading={false}>
          Next
        </LoadingButton>
      </div>
      <TraingCertificateModal setVisibility={setVisibility} visibility={visibility} />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  title: {
    fontWeight: fontWeight.medium,
    fontSize: fontSizes.title,
    fontFamilly: fontFamily.primary,
    color: colors.dark,
    marginBottom: theme.spacing(10),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .header-text': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      fontFamilly: fontFamily.primary,
      color: colors.dark,
      paddingBottom: spaces.large,
    },
    '& .btn-modal': {
      width: 32,
      height: 32,
      background: colors.white,
      borderRadius: borderRadius.default,
      border: '1px solid #CDCED9',
      cursor: 'pointer',
      '& > *': {
        margin: 8,
      },
    },
  },
  institution: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    margin: `${theme.spacing(8)}px 0 ${theme.spacing(8)}px`,
    '& > :nth-child(2)': {
      marginLeft: theme.spacing(10),
    },
    '& > :nth-child(3)': {
      marginLeft: 'auto',
      alignSelf: 'start',
      '& > :nth-child(2)': {
        marginLeft: theme.spacing(5),
      },
    },
  },
  foot: {
    display: 'flex',
    marginTop: theme.spacing(25),
    '& .btn': {
      marginLeft: 'auto',
      width: 100,
      height: 44,
    },
  },
}));

export default TrainingAndCertificate;
