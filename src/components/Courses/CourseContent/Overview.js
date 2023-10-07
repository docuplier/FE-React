import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { CheckSharp } from '@material-ui/icons';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AboutCourseCard from '../AboutCourseCard';
import CourseInfoCard from 'reusables/CourseInfoCard';
import { borderRadius, colors, fontSizes, fontWeight } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';
import AccessControl from 'reusables/AccessControl';
import { UserRoles } from 'utils/constants';

const Overview = ({
  lectureDescriptionHtml,
  aboutCourseProps,
  courseIncludes,
  markCourseAsCompleted,
  isLoading,
  isCompleted,
}) => {
  const classes = useStyles();

  return (
    <div>
      <Accordion defaultExpanded={true} className={classes.aboutCourse}>
        <AccordionSummary expandIcon={<ExpandMoreIcon className="expandIcon" />} id="accordion">
          <Typography component="h4" className={classes.title}>
            About this course
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box py={12} px={8}>
            <AboutCourseCard {...aboutCourseProps} />
          </Box>
        </AccordionDetails>
      </Accordion>
      <Box mt={12} mb={8} className={classes.lectureDescription}>
        <Paper>
          <Typography color="textPrimary" variant="h6" className={classes.title}>
            Lecture description
          </Typography>
          <Typography
            color="textPrimary"
            variant="body2"
            dangerouslySetInnerHTML={{ __html: lectureDescriptionHtml }}
          />
        </Paper>
      </Box>
      <Box mt={12} mb={12}>
        <CourseInfoCard {...courseIncludes} />
      </Box>
      <AccessControl allowedRoles={[UserRoles.STUDENT]}>
        <Box>
          <LoadingButton
            style={{
              background: isCompleted ? '#F1F2F6' : colors.imageBackground,
              color: colors.primary,
              cursor: isCompleted && 'not-allowed',
            }}
            type="submit"
            fullWidth
            onClick={markCourseAsCompleted}
            disabled={isCompleted}
            isLoading={isLoading}>
            <CheckSharp style={{ marginRight: 18 }} />{' '}
            {isCompleted ? 'Course completed' : 'Mark as completed'}
          </LoadingButton>
        </Box>
      </AccessControl>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  lectureDescription: {
    color: '#393A4A',
    '& .MuiPaper-root': {
      padding: 24,
      background: '#F1F2F6',
      borderRadius: 8,
      border: '1px solid #CDCED9',
      margin: '16px 0px',
    },
  },
  title: {
    fontWeight: fontWeight.bold,
    color: colors.dark,
    fontSize: fontSizes.xxlarge,
  },
  aboutCourse: {
    '& .MuiAccordionSummary-root': {
      borderBottom: `1px solid ${colors.secondaryLightGrey}`,
      boxShadow: borderRadius.md,
      '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(8),
      },
      '& .MuiAccordionSummary-expandIcon': {
        marginRight: theme.spacing(8),
      },
    },
    '& .MuiAccordionDetails-root': {
      background: colors.secondary,
      display: 'block',
    },
    '& .MuiCollapse-wrapperInner': {
      border: '1px solid #CDCED9',
    },
    '& .expandIcon': {
      fontSize: fontSizes.largeTitle,
    },
  },
}));

Overview.propTypes = {
  lectureDescriptionHtml: PropTypes.string,
  aboutCourseProps: PropTypes.shape({
    ...AboutCourseCard.propTypes,
  }),
  courseIncludes: PropTypes.shape({
    courseDuration: PropTypes.number,
    pdfCount: PropTypes.number,
    audioCount: PropTypes.number,
    resourceCount: PropTypes.number,
    lifeTimeAccess: PropTypes.bool,
    screens: PropTypes.bool,
    certificate: PropTypes.bool,
  }),
  markCourseAsCompleted: PropTypes.func,
  isLoading: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

export default React.memo(Overview);
