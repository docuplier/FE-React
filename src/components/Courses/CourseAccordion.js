import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Box } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ReactComponent as AudioIcon } from 'assets/svgs/audio.svg';
import { ReactComponent as VideoIcon } from 'assets/svgs/video.svg';
import { ReactComponent as FileIcon } from 'assets/svgs/file.svg';
import { fontSizes, colors, fontWeight } from '../../Css';
import { LectureResourceType } from 'utils/constants';
import { convertTimeSpentToDuration, transformValueToPluralForm } from 'utils/TransformationUtils';

const CourseAccordion = (props) => {
  const { data, onClickLecture } = props;

  const renderIcon = (type) => {
    switch (type) {
      case LectureResourceType.VIDEO:
        return <VideoIcon />;
      case LectureResourceType.AUDIO:
        return <AudioIcon />;
      default:
        return <FileIcon />;
    }
  };

  return (
    <div>
      {data?.map(({ title, lectureDurationCount, sectionLectures }, index) => {
        let sectionIndex = index + 1;
        return (
          <Accordion>
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
              expandIcon={<ExpandMoreIcon />}>
              <Grid container={10}>
                <Grid item xs={6} className="left-summary-text">
                  {sectionIndex}. {title}
                </Grid>
                <Grid item xs={6} className="right-summary-text">
                  {transformValueToPluralForm(sectionLectures?.length, 'lecture')} •{' '}
                  {convertTimeSpentToDuration(lectureDurationCount)}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              {sectionLectures?.map(({ id, title, duration, type }, index) => {
                let lecturesIndex = index + 1;
                return (
                  <Box className="accordion-detail-item" mb={8} onClick={() => onClickLecture(id)}>
                    {renderIcon(type)}
                    <Grid container={8}>
                      <Grid item xs={6} className="left-summary-text">
                        {sectionIndex}.{lecturesIndex} {title}
                      </Grid>
                      <Grid item xs={6} className="right-summary-text">
                        {convertTimeSpentToDuration(duration)}
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

const Accordion = withStyles({
  root: {
    fontSize: fontSizes.large,
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
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
    padding: '0px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
    '& .left-summary-text': {
      paddingLeft: 16,
      fontWeight: fontWeight.medium,
    },
    '& .right-summary-text': {
      textAlign: 'right',
      color: colors.grey,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expandIcon: {
    order: -1,
    padding: 0,
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: '24px 24px 8px 24px',
    display: 'block',
    '& .accordion-detail-item': {
      width: '100%',
      display: 'flex',
    },
    '& .accordion-detail-item:hover': {
      cursor: 'pointer',
    },
    '& .left-summary-text': {
      paddingLeft: 16,
    },
    '& .right-summary-text': {
      textAlign: 'right',
    },
    '& svg': {
      height: 16,
    },
  },
}))(MuiAccordionDetails);

CourseAccordion.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      lectureDurationCount: PropTypes.string,
      sectionLectures: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          duration: PropTypes.string,
        }),
      ),
    }),
  ),
};

export default CourseAccordion;
