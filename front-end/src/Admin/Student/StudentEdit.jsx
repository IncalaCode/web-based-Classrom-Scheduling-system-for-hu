import React from "react";
import { Edit, SimpleForm, TextInput, required ,SelectInput} from "react-admin";
const gradeChoices = [
  { id: '9', name: 'Grade 9' },
  { id: '10', name: 'Grade 10' },
];
const StudentEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="firstName" label="First Name" fullWidth validate={[required()]} />
        <TextInput source="lastName" label="Last Name" fullWidth validate={[required()]} />
        <TextInput source="student_id" label="Student ID" defaultValue="1746/14" fullWidth validate={[required()]} />
        <TextInput source="email" label="Email" fullWidth validate={[required()]} />
        <TextInput source="dateOfBirth" label="Date Of Birth" fullWidth validate={[required()]} />
        <TextInput source="enrollmentDate" label="Enrollment Date" fullWidth validate={[required()]} />
        <SelectInput 
          source="grade" 
          label="Grade" 
          choices={gradeChoices} 
          fullWidth 
          validate={[required()]} 
        />
      </SimpleForm>
    </Edit>
  );
};

export default StudentEdit;
