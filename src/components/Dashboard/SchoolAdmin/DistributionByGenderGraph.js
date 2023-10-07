import { Box, Paper } from '@material-ui/core';
import PieChart from 'components/Dashboard/PieChart';
import LoadingView from 'reusables/LoadingView';

const DistributionByGenderGraph = ({ data, width, height, chartEvents, isLoading }) => {
  return (
    <Box component={Paper} elevation={0} p={12}>
      <LoadingView isLoading={isLoading}>
        <PieChart
          chartEvents={chartEvents}
          data={data}
          direction="vertical"
          title="Distribution by Gender"
        />
      </LoadingView>
    </Box>
  );
};

export default DistributionByGenderGraph;
