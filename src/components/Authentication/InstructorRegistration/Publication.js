import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Divider, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//components
import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import icon from 'assets/svgs/pub-icon.svg';
import { ReactComponent as Plus } from 'assets/svgs/plus.svg';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import PublicationModal from './PublicationModal';
import Empty from './Empty';

const mockdata = [
  {
    icon: icon,
    name: 'Black Hole Image',
    course: 'John Hopkins Tribune (2021)',
    year: 'www.johnhopkins.com/edu/publication/wuey8473_87ughr4u',
  },
  {
    icon: icon,
    name: 'Black Hole Image',
    course: 'John Hopkins Tribune (2021)',
    year: 'www.johnhopkins.com/edu/publication/wuey8473_87ughr4u',
  },
  {
    icon: icon,
    name: 'Black Hole Image',
    course: 'John Hopkins Tribune (2021)',
    year: 'www.johnhopkins.com/edu/publication/wuey8473_87ughr4u',
  },
];

const Publication = () => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);

  const handleModal = () => {
    setOpenModal(true);
  };

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className="header-text">
            Publication <span className="optional">(optional)</span>
          </Typography>
          <Box className="btn-modal" onClick={handleModal}>
            <Plus />
          </Box>
        </div>
        <div>
          {mockdata.length === 0 && <Empty onClick={handleModal} />}
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
                    <Link to={year} className="link">
                      {year}
                    </Link>
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
          isLoading={false}>
          Complete registration
        </LoadingButton>
      </div>
      <PublicationModal openModal={openModal} setOpenModal={setOpenModal} />
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
    '& .link': {
      color: colors.primary,
      textDecoration: 'none',
    },
    '& > :last-child': {
      marginLeft: spaces.medium,
    },
  },
  btn: {
    width: 233,
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

export default Publication;
