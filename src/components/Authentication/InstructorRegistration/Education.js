import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

//components
import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import icon from 'assets/svgs/edu-icon.svg';
import { ReactComponent as Plus } from 'assets/svgs/plus.svg';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import EducationModal from './EducationModal';
import Empty from './Empty';
import { GET_EDUCATION_HISTORY } from 'graphql/queries/instructorsReg';
import useNotification from 'reusables/NotificationBanner/useNotification';

const mockdata = [
  {
    icon: icon,
    name: 'Yale University',
    course: 'Bachelor of Science (B.Sc), Political Science',
    year: '2010 - 2021',
  },
  {
    icon: icon,
    name: 'Yale University',
    course: 'Bachelor of Science (B.Sc), Political Science',
    year: '2010 - 2021',
  },
  {
    icon: icon,
    name: 'Yale University',
    course: 'Bachelor of Science (B.Sc), Political Science',
    year: '2010 - 2021',
  },
];

const Education = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const notification = useNotification();

  const handleModal = () => {
    setOpenModal(true);
  };

  const handleClick = () => {
    handleNextTab(activeTab + 1);
  };

  const { data, loading: _isLoading } = useQuery(GET_EDUCATION_HISTORY, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className="header-text">
            Educational history <span className="optional">(optional)</span>
          </Typography>
          <Box className="btn-modal" onClick={handleModal}>
            <Plus />
          </Box>
        </div>
        {mockdata.length === 0 && <Empty onClick={handleModal} />}
        <div>
          {mockdata.map((data, index) => {
            const { icon, name, course, year } = data;
            return (
              <div key={index}>
                <div className={classes.wrapper}>
                  <Box>
                    <img src={icon} alt={name} />
                  </Box>
                  <Box>
                    <Typography className="name"> {name}</Typography>
                    <Typography>{course}</Typography>
                    <Typography>{year}</Typography>
                  </Box>
                </div>
                <Box className={classes.footer}>
                  <Button>Delete</Button>
                  <Button color="primary">Edit</Button>
                </Box>
                <Divider />
              </div>
            );
          })}
        </div>
        <LoadingButton
          endIcon={<AngleRight />}
          className={classes.btn}
          type="submit"
          color="primary"
          isLoading={false}
          onClick={handleClick}>
          Save & next
        </LoadingButton>
      </div>
      <EducationModal openModal={openModal} setOpenModal={setOpenModal} />
    </React.Fragment>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
    '& > :nth-child(2)': {
      marginTop: 40,
    },
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
    '& .optional': {
      fontWeight: fontWeight.regular,
      color: colors.grey,
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
  wrapper: {
    display: 'flex',
    marginTop: spaces.small,
    '& .name': {
      fontWeight: fontWeight.bold,
    },
    '& > :last-child': {
      marginLeft: spaces.medium,
    },
  },
  btn: {
    width: 154,
    height: 44,
    borderRadius: borderRadius.default,
    float: 'right',
    marginTop: 50,
  },
  footer: {
    margin: '0 0 10px 60px',
    '& > :first-child': {
      color: 'red',
    },
  },
}));

export default Education;
