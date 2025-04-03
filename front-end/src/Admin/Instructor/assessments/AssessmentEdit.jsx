import React from 'react';
import { Edit, useRecordContext } from 'react-admin';
import AssessmentForm from './AssessmentForm';

const AssessmentEdit = props => {
  return (
    <Edit 
      {...props} 
      title="Edit Assessment"
      mutationMode="pessimistic"
    >
      <AssessmentFormWrapper />
    </Edit>
  );
};


const AssessmentFormWrapper = () => {
  const record = useRecordContext();
  
  if (!record) return null;
  
  return <AssessmentForm isEdit={true} record={record} />;
};

export default AssessmentEdit;
