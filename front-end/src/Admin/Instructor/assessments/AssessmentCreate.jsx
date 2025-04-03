import React from 'react';
import { Create } from 'react-admin';
import AssessmentForm from './AssessmentForm';

const AssessmentCreate = props => {
  return (
    <Create 
      {...props} 
      title="Create Assessment"
    >
      <AssessmentForm isEdit={false} />
    </Create>
  );
};

export default AssessmentCreate;
