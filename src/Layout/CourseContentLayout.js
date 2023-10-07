import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  Typography,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  Drawer,
} from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Menu as MenuIcon } from '@material-ui/icons';
import { PrivatePaths } from 'routes';

import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes, fontWeight } from '../Css';

const CourseContentLayout = (props) => {
  const {
    tabs,
    onTabChange,
    defaultTabIndex = 0,
    children,
    syllabus,
    lecturePreviewItem,
    onSelectLecture,
    currentLectureId,
    defaultSelectedSectionId,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTabIndex);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [open, setOpen] = useState(false);
  const { courseId } = useParams();

  const theme = useTheme();
  const isMdScreenAndAbove = useMediaQuery(theme.breakpoints.up('md'));
  const isLGScreenAndAbove = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    if (!selectedSectionId) {
      setSelectedSectionId(defaultSelectedSectionId);
    }
    // eslint-disable-next-line
  }, [defaultSelectedSectionId]);

  const handleChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
    onTabChange(newValue);
  };

  const handleChangeSection = (sectionId) => () => {
    setSelectedSectionId((prevState) => {
      if (prevState === sectionId) {
        return null;
      }
      return sectionId;
    });
  };

  function renderMenu() {
    return (
      <div className={classes.menu}>
        <Box className="menu-title">
          <ArrowBackIcon
            className="backIcon"
            onClick={() => history.push(`${PrivatePaths.COURSES}/${courseId}`)}
          />
          Course content
        </Box>
        {syllabus.map(({ title, content, sectionId }) => (
          <Accordion
            onChange={handleChangeSection(sectionId)}
            expanded={selectedSectionId === sectionId}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography className={classes.heading}>{title}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              {content.map(({ id, topic, duration }) => (
                <Box className="accordion-detail-item" onClick={() => onSelectLecture(id)}>
                  <CheckCircleIcon
                    className={classnames('icon', {
                      active: currentLectureId === id,
                    })}
                  />
                  <Typography>
                    {topic}
                    <Box className="duration-section">
                      <PlayArrowIcon className="icon" />
                      <span>{duration} </span>
                    </Box>
                  </Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    );
  }

  const renderMobileCourseMenuDrawer = () => {
    return (
      <>
        <Box display="flex" alignItems="center">
          <MenuIcon className={classes.courseMenuIcon} onClick={() => setOpen(true)} />
          <span className={classes.MenuText}>
            <b>Course Content</b>
          </span>
        </Box>
        <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
          <Box className={classes.drawer}> {renderMenu()}</Box>
        </Drawer>
      </>
    );
  };

  return (
    <>
      <div className={classes.Layout}>
        {!isMdScreenAndAbove && (
          <MaxWidthContainer>{renderMobileCourseMenuDrawer()}</MaxWidthContainer>
        )}
        <Grid container>
          {isMdScreenAndAbove && (
            <Grid item md={3} lg={2}>
              {renderMenu()}
            </Grid>
          )}
          <Grid item xs={12} md={9} lg={10} className={classes.contentSection}>
            <Box className="content-section-header">{lecturePreviewItem}</Box>
            <Box className={classes.navigation}>
              <MaxWidthContainer>
                <Box px={isLGScreenAndAbove ? 5 : 0}>
                  <StyledTabs
                    indicatorColor="primary"
                    textColor="primary"
                    value={selectedTabIndex}
                    onChange={handleChange}>
                    {tabs.map((tab, i) => (
                      <Tab disableRipple label={tab} key={i} />
                    ))}
                  </StyledTabs>
                </Box>
              </MaxWidthContainer>
            </Box>
            <MaxWidthContainer spacing="lg">
              <Box px={isLGScreenAndAbove ? 5 : 0}>{children}</Box>
            </MaxWidthContainer>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CourseContentLayout;

const useStyles = makeStyles((theme) => ({
  Layout: {
    background: colors.background,
    minHeight: '100vh',
    height: '100%',
    maxWidth: '100vw',
    '& .MuiGrid-spacing-xs-3 > .MuiGrid-item': {
      padding: 0,
    },
  },
  courseMenuIcon: {
    padding: `20px 20px 20px 0px`,
    cursor: 'pointer',
    color: '#565D66',
  },
  MenuText: {
    color: '#565D66',
  },
  drawer: {
    maxWidth: 328,
    minWidth: 300,
    minHeight: '100vh',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100vw',
    },
  },
  menu: {
    position: 'sticky',
    top: 70,
    background: colors.dark,
    color: '#F1F2F6',
    height: 'calc(100vh + 70px)',
    '& .menu-title': {
      padding: 16,
      borderBottom: `1px solid ${colors.grey}`,
      fontSize: fontSizes.xlarge,
      display: 'flex',
      alignItems: 'center',
      '& .backIcon': {
        marginRight: 10,
        cursor: 'pointer',
      },
    },
  },
  contentSection: {
    // padding: '0px 40px',
    '& .content-section-header': {
      background: colors.seperator,
      minHeight: 113,
    },
  },

  navigation: {
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    height: 'auto',
    position: 'sticky',
    top: 70,
    zIndex: 10,
    '& .navigation-item': {
      marginRight: 15,
      height: '100%',
      borderBottom: '1px solid blue',
      borderRadius: '4px 5px 0px 0px',
    },
  },
}));

// Configurations for customizing the default Tab and Tabs component for MaterialUI
const StyledTabs = withStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 20,
    },
  },
}))((props) => <Tabs {...props} variant="scrollable" TabIndicatorProps={{ children: <span /> }} />);

// Configurations for customizing the default Accordion component for MaterialUI
const Accordion = withStyles({
  root: {
    borderBottom: `1px solid ${colors.grey}`,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: colors.dark,
    color: '#F1F2F6',
    fontSize: fontSizes.xlarge,
    borderBottom: `1px solid ${colors.grey}`,
    padding: '0px 16px',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
    '& .MuiIconButton-root': {
      color: '#F1F2F6',
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: '8px 16px',
    background: '#393A4A',
    borderBottom: `0px solid ${colors.grey}`,
    color: '#F1F2F6',
    display: 'block',
    '& .MuiTypography-body1': {
      fontWeight: fontWeight.light,
      fontSize: fontSizes.medium,
    },
    '& .icon': {
      width: 14,
      height: 14,
      paddingRight: 9,
    },
    '& .duration-section': {
      marginTop: 4,
      fontSize: fontSizes.small,
    },
    '& .accordion-detail-item': {
      display: 'flex',
      marginBottom: 10,
      cursor: 'pointer',
    },
    '& .active': {
      fill: colors.textSuccess,
    },
  },
}))(MuiAccordionDetails);

CourseContentLayout.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
  onSelectLecture: PropTypes.func,
  defaultTabIndex: PropTypes.number,
  children: PropTypes.element,
  lecturePreviewItem: PropTypes.node,
  syllabus: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      sectionId: PropTypes.string,
      content: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          topic: PropTypes.string,
          duration: PropTypes.string,
        }),
      ),
    }),
  ),
  currentLectureId: PropTypes.string,
  defaultSelectedSectionId: PropTypes.string,
};
