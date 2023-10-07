import { Box, Paper } from '@material-ui/core';

import DonutChart from 'components/Dashboard/DonutChart';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const CourseStatisticsGraph = ({ data, isLoading }) => {
  return (
    <Box component={Paper} elevation={0} p={12}>
      <LoadingView isLoading={isLoading}>
        {isLoading ? (
          <Empty title="No course statistics available" />
        ) : (
          <DonutChart title="Course Statistics" data={data} />
        )}
      </LoadingView>
    </Box>
  );
};

export default CourseStatisticsGraph;
