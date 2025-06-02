import React from "react";
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  SelectInput,
  required, 
  email,
  useGetList 
} from "react-admin";
import InputVildcation from "../../components/inputvildcation";

// Validation function for department name
const validateDepartmentName = (value) => {
  if (!value) return 'Department name is required';
  if (!/^[A-Z][a-zA-Z\s]*$/.test(value)) {
    return 'Department name must start with a capital letter and contain only letters and spaces';
  }
  return undefined;
};

// Validation for email
const validateEmail = [
  required(),
  email('Invalid email format')
];

const DepartmentHeadEdit = (props) => {
  // Fetch facilitators data
  const { data: facilitators, isLoading } = useGetList('facilitators', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'firstName', order: 'ASC' }
  });

  // Transform facilitators data for select input
  const facilitatorChoices = facilitators
    ? facilitators.map(facilitator => ({
        id: facilitator.id,
        name: `${facilitator.firstName} ${facilitator.lastName}`
      }))
    : [];

  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput 
          source="firstName" 
          label="First Name" 
          fullWidth 
          validate={[required()]}
           parse={value => InputVildcation(value, "letter")}
        />
        <TextInput 
          source="lastName" 
          label="Last Name" 
          fullWidth 
          validate={[required()]}
           parse={value => InputVildcation(value, "letter")}
        />
        <TextInput 
          source="email" 
          label="Email" 
          fullWidth 
          validate={validateEmail}
        />
        <TextInput 
          source="departmentName" 
          label="Department Name" 
          helperText="Must start with a capital letter (e.g., Computer Science)" 
          fullWidth 
          validate={validateDepartmentName}
        />
        <SelectInput
          source="facilitatorId"
          label="Facilitator"
          choices={facilitatorChoices}
          optionText="name"
          optionValue="id"
          fullWidth
          validate={[required('Please select a facilitator')]}
          isLoading={isLoading}
        />
      </SimpleForm>
    </Edit>
  );
};

export default DepartmentHeadEdit;
