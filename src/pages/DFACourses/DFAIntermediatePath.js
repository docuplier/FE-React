import React from 'react';
import DFAAssessmentLayout from 'Layout/DFALayout/DFAAssessmentLayout';
import DFAIntermediateLevel from './DFAIntermediateLevel';
import DFAIntermediateInstruction from 'pages/DFADashboard/DFAIntermediateInstruction';

const DFAIntermediatePath = () => {
  const [showInstructions, setShowInstructions] = React.useState(false);
  return (
    <DFAAssessmentLayout>
      {showInstructions ? (
        <DFAIntermediateInstruction />
      ) : (
        <DFAIntermediateLevel
          onOk={() => {
            setShowInstructions(true);
          }}
        />
      )}
    </DFAAssessmentLayout>
  );
};

export default DFAIntermediatePath;
