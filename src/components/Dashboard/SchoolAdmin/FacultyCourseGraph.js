import { Box, Paper } from '@material-ui/core';
import PieChart from 'components/Dashboard/PieChart';

const FacultyCoursesGraph = ({ data, width, height, chartEvents }) => {
  return (
    <Box component={Paper} elevation={0} p={12}>
      <PieChart
        chartEvents={chartEvents}
        data={data}
        direction="vertical"
        title="Courses per Faculty"
      />
    </Box>
  );
};

export default FacultyCoursesGraph;
