import AssessmentList from './AssessmentList';
import AssessmentEdit from './AssessmentEdit';
import AssessmentCreate from './AssessmentCreate';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

// Resource configuration for React Admin
export const assessmentResource = {
  name: 'Assessment',
  list: AssessmentList,
  edit: AssessmentEdit,
  create: AssessmentCreate,
  icon: AssignmentIcon
};

export {
  AssessmentList,
  AssessmentEdit,
  AssessmentCreate
};

export default {
  AssessmentList,
  AssessmentEdit,
  AssessmentCreate,
  assessmentResource
};